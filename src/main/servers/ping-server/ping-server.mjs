import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { z } from 'zod';

const execAsync = promisify(exec);

export const execCommand = async command => {
  const { stdout, stderr } = await execAsync(command);
  return { stdout, stderr };
};

const server = new McpServer({
  name: 'ping-server',
  version: '1.0.0',
  capabilities: {
    tools: {}
  }
});

const PingSchema = z.object({
  target_name: z.string().describe('Target hostname or IP address'),
  count: z.number().int().nullable().describe('Number of echo requests to send (-n)'),
  size: z.number().int().nullable().describe('Send buffer size (-l)'),
  ttl: z.number().int().nullable().describe('Time to live (-i)'),
  timeout: z.number().int().nullable().describe('Timeout in milliseconds (-w)'),
  ipv4: z.boolean().nullable().describe('Force IPv4 (-4)'),
  ipv6: z.boolean().nullable().describe('Force IPv6 (-6)')
});

server.tool(
  'ping_host',
  'Ping a specified host with optional parameters',
  PingSchema.shape,
  async ({ target_name, count, size, ttl, timeout, ipv4, ipv6 }) => {
    try {
      const args = [];

      if (count) args.push('-n', count.toString());
      if (size) args.push('-l', size.toString());
      if (ttl) args.push('-i', ttl.toString());
      if (timeout) args.push('-w', timeout.toString());
      if (ipv4) args.push('-4');
      if (ipv6) args.push('-6');

      args.push(target_name);

      const command = `ping ${args.join(' ')}`;

      const { stdout, stderr } = await execCommand(command);

      return {
        content: [
          {
            type: 'text',
            text: stdout || stderr || 'The command returned no output.'
          }
        ]
      };
    } catch (err) {
      return {
        content: [
          {
            type: 'text',
            text: err?.message || 'An unknown error occurred while executing nmap'
          }
        ]
      };
    }
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log('Ping MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

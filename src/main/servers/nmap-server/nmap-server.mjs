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
  name: 'nmap-server',
  version: '1.0.0',
  capabilities: {
    tools: {}
  }
});

const NmapSchema = z.object({
  target: z.string().describe('IP address, domain, or CIDR range'),
  ports: z.string().nullable().describe('Port(s) to scan, e.g. "80,443" or "1-1000"'),
  fast: z.boolean().nullable().describe('Use fast scan (-F)'),
  os_detection: z.boolean().nullable().describe('Enable OS detection (-O)'),
  service_version: z.boolean().nullable().describe('Detect service versions (-sV)'),
  timing: z.enum(['T0', 'T1', 'T2', 'T3', 'T4', 'T5']).nullable().describe('Timing template (-T)'),
  extra_args: z.string().nullable().describe('Any extra Nmap arguments')
});

server.tool(
  'nmap_scan',
  'Run an nmap scan on a target',
  NmapSchema.shape,
  async ({ target, ports, fast, os_detection, service_version, timing, extra_args }) => {
    try {
      const args = [];

      if (ports) args.push(`-p ${ports}`);
      if (fast) args.push('-F');
      if (os_detection) args.push('-O');
      if (service_version) args.push('-sV');
      if (timing) args.push(`-${timing}`);
      if (extra_args) args.push(extra_args);

      args.push(target);

      const command = `nmap ${args.join(' ')}`;

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
  console.log('Nmap MCP Server running on stdio');
}

main().catch(error => {
  console.error('Fatal error in main():', error);
  process.exit(1);
});

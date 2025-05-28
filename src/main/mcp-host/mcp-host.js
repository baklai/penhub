import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

export class MCPHost {
  #clients = [];

  async connect(name, command, args) {
    const client = new Client(
      { name: `mcp-client-${name}`, version: '1.0.0' },
      { capabilities: { prompts: {}, resources: {}, tools: {} } }
    );
    const transport = new StdioClientTransport({ command, args });
    client.connect(transport);
    this.#clients.push(client);
  }

  async callTool(name, args) {
    for (const client of this.#clients) {
      const tools = await client.listTools();
      const tool = tools.tools.find(tool => tool.name === name);
      if (tool) {
        return await client.callTool({ name, arguments: args });
      }
    }
    return '';
  }

  async listTools() {
    const allTools = await Promise.all(this.#clients.map(c => c.listTools()));
    return allTools.flatMap(r => r.tools);
  }

  async close() {
    for (const client of this.#clients) await client.close();
    this.#clients = [];
  }
}

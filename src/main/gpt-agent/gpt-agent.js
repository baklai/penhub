import OpenAI from 'openai';
import { join } from 'path';

import { MCPHost } from '../mcp-host/mcp-host.js';

const SYSTEM_MESSAGE_PROMPT = {
  role: 'system',
  content: [
    'You are a helpful assistant-agent who supports your user.',
    "You are well acquainted with your tools and resources and use them to solve the user's problems.",
    'When asked to complete a task, you perform as many actions autonomously as possible.',
    'The only exception to this rule is tasks that could be potentially destructive.',
    'If you can achieve the goal directly, you return the result.',
    'If the task cannot be completed, you explain the reason.',
    `Today's date is: ${new Date().toISOString().split('T')[0]}`
  ].join(' ')
};

const SYSTEM_MCP_SERVERS = {
  mcpServers: {
    ping: {
      command: 'node',
      args: [join(__dirname, 'servers', 'ping-server.mjs')]
    },
    nmap: {
      command: 'node',
      args: [join(__dirname, 'servers', 'nmap-server.mjs')]
    }
  }
};

export class GPTAgent {
  #mcphost = null;
  #messages = [];
  #openai = null;
  #apiModel = null;
  #apiKey = null;

  constructor() {}

  async connect(apiKey, apiModel = 'gpt-3.5-turbo') {
    if (!apiKey || !apiModel) {
      console.error('API key or model is not provided.');
      return false;
    }

    this.#apiKey = apiKey;
    this.#apiModel = apiModel;

    if (this.#openai && this.#mcphost) {
      this.#mcphost = null;
      this.#openai = null;
    }

    try {
      this.#openai = new OpenAI({ apiKey: this.#apiKey });

      this.#mcphost = new MCPHost();

      this.#messages = [SYSTEM_MESSAGE_PROMPT];

      try {
        const { mcpServers } = SYSTEM_MCP_SERVERS;

        for (const server in mcpServers) {
          const srv = mcpServers[server];
          await this.#mcphost.connect(server, srv.command, srv.args);
        }
      } catch (err) {
        console.error('Failed init model context protocol:', err.message);
      }
    } catch (err) {
      console.error('Failed init OpenAI API:', err.message);
    }

    if (this.#openai && this.#mcphost) {
      console.info('GPT Agent connected successfully.');
      return true;
    }
    console.error('Failed to connect GPT Agent.');
    return false;
  }

  async disconnect() {
    if (!this.#openai && !this.#mcphost) {
      return true;
    }

    try {
      this.#openai = null;
      this.#messages = [];
      await this.#mcphost?.close();

      this.#mcphost = null;
    } catch (err) {
      console.error('Failed to disconnected GPT Agent:', err.message);
    }

    if (!this.#openai && !this.#mcphost) {
      console.info('GPT Agent disconnected successfully.');
      return true;
    }

    console.error('Failed to disconnect GPT Agent.');
    return false;
  }

  async tools() {
    if (!this.#mcphost) return [];
    const tools = await this.#mcphost.listTools();

    if (tools?.length) {
      return tools.map(tool => ({
        name: tool.name,
        description: tool.description
      }));
    }

    return [];
  }

  async prompts() {
    // const prompts = await this.#mcphost.listPrompts();

    // if (prompts?.length) {
    //   return prompts.map(prompt => ({
    //     name: prompt.name,
    //     description: prompt.description
    //   }));
    // }

    return [];
  }

  async query(query) {
    this.#messages.push({ role: 'user', content: query });

    const tools = await this.#mcphost.listTools();

    const response = await this.#openai.responses.create({
      model: this.#apiModel,
      input: this.#messages,
      tools: tools.map(tool => ({
        type: 'function',
        name: tool.name,
        description: tool.description,
        parameters: tool.inputSchema,
        strict: true
      }))
    });

    if (response?.output_text?.length) {
      this.#messages.push({ role: 'assistant', content: response.output_text });
      return response.output_text;
    }

    for (const output of response.output || []) {
      if (output.type !== 'message' && output.type !== 'function_call') {
        continue;
      }

      if (output.type === 'message') {
        this.#messages.push({
          role: 'assistant',
          content: output.content
            .filter(item => item.type === 'output_text')
            .map(item => item.text)
            .join(' ')
        });
      }

      if (output.type === 'function_call') {
        this.#messages.push(output);

        const toolName = output.name;
        const toolArgs = JSON.parse(output.arguments);

        console.info(
          `\r\x1b[34m>\x1b[0m \x1b[90mCalling tool ${toolName} with args ${JSON.stringify(toolArgs)}\x1b[0m`
        );

        const toolResult = await this.#mcphost.callTool(toolName, toolArgs);

        this.#messages.push({
          type: 'function_call_output',
          call_id: output.call_id,
          output: JSON.stringify(toolResult || '')
        });
      }
    }

    const result = await this.#openai.responses.create({
      model: this.#apiModel,
      input: this.#messages
    });

    this.#messages.push({ role: 'assistant', content: result.output_text });

    return result.output_text;
  }

  async cleanup() {
    await this.#mcphost.close();
  }
}

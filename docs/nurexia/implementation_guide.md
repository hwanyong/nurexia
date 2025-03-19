# Nurexia 구현 가이드

이 문서는 Nurexia AI 코드 에이전트의 구현에 관한 가이드라인을 제공합니다.

## 개발 환경 설정

### 필수 요구사항
- Node.js v18 이상
- pnpm v8 이상
- TypeScript 5.0 이상

### 초기 설정
```bash
# 저장소 클론
git clone https://github.com/your-username/nurexia.git
cd nurexia

# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm dev
```

## 프로젝트 구조

```
nurexia/
├── src/
│   ├── cli/            # CLI 진입점 및 UI 컴포넌트
│   ├── agents/         # AI 에이전트 구현
│   ├── processors/     # 코드 처리 로직
│   ├── integrations/   # 외부 시스템 통합
│   ├── utils/          # 유틸리티 함수
│   └── types/          # TypeScript 타입 정의
├── docs/               # 문서
├── tests/              # 테스트 코드
├── examples/           # 예제 코드
└── config/             # 설정 파일
```

## 모듈별 구현 가이드

### 1. UI 레이어 구현 (src/cli)

#### ScreenManager
터미널 화면 관리 및 레이아웃을 제어하는 모듈입니다.

```typescript
// src/cli/ScreenManager.ts
import blessed from 'blessed';

export class ScreenManager {
  private screen: blessed.Widgets.Screen;

  constructor() {
    this.screen = blessed.screen({
      smartCSR: true,
      title: 'Nurexia'
    });

    this.setupKeyHandlers();
  }

  private setupKeyHandlers(): void {
    // 키 이벤트 핸들러 설정
    this.screen.key(['C-c'], () => process.exit(0));
  }

  public getScreen(): blessed.Widgets.Screen {
    return this.screen;
  }

  public render(): void {
    this.screen.render();
  }
}
```

#### PanelSystem
화면의 패널 구성을 관리합니다.

```typescript
// src/cli/PanelSystem.ts
import blessed from 'blessed';
import { ScreenManager } from './ScreenManager';

export class PanelSystem {
  private screen: blessed.Widgets.Screen;
  private leftPanel: blessed.Widgets.BoxElement;
  private mainPanel: blessed.Widgets.BoxElement;
  private rightPanel: blessed.Widgets.BoxElement;

  constructor(screenManager: ScreenManager) {
    this.screen = screenManager.getScreen();
    this.initializePanels();
  }

  private initializePanels(): void {
    // 패널 초기화 로직
  }

  // 기타 패널 관련 메서드
}
```

### 2. 에이전트 레이어 구현 (src/agents)

#### AgentOrchestrator
여러 에이전트를 조율하는 중앙 컴포넌트입니다.

```typescript
// src/agents/AgentOrchestrator.ts
import { CodeAnalysisAgent } from './CodeAnalysisAgent';
import { CodeGenerationAgent } from './CodeGenerationAgent';
import { RefactoringAgent } from './RefactoringAgent';
import { ContextManager } from './ContextManager';

export class AgentOrchestrator {
  private codeAnalysisAgent: CodeAnalysisAgent;
  private codeGenerationAgent: CodeGenerationAgent;
  private refactoringAgent: RefactoringAgent;
  private contextManager: ContextManager;

  constructor() {
    this.contextManager = new ContextManager();
    this.codeAnalysisAgent = new CodeAnalysisAgent(this.contextManager);
    this.codeGenerationAgent = new CodeGenerationAgent(this.contextManager);
    this.refactoringAgent = new RefactoringAgent(this.contextManager);
  }

  public async processRequest(request: string): Promise<any> {
    // 요청 유형에 따라 적절한 에이전트로 라우팅
  }
}
```

#### LangChain 및 LangGraph 통합

```typescript
// src/agents/CodeGenerationAgent.ts
import { ChatPromptTemplate } from "langchain/prompts";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { ContextManager } from './ContextManager';

export class CodeGenerationAgent {
  private model: ChatOpenAI;
  private contextManager: ContextManager;

  constructor(contextManager: ContextManager) {
    this.contextManager = contextManager;
    this.model = new ChatOpenAI({
      modelName: "gpt-4",
      temperature: 0.2
    });
  }

  public async generateCode(spec: string): Promise<string> {
    const context = this.contextManager.getCurrentContext();

    const prompt = ChatPromptTemplate.fromTemplate(`
      You are an expert code generator.

      Current project context:
      {context}

      Generate code based on the following specification:
      {spec}

      Provide only the code with no explanations.
    `);

    const chain = prompt.pipe(this.model);
    const result = await chain.invoke({
      context,
      spec
    });

    return result.content;
  }
}
```

### 3. 코드 처리 레이어 구현 (src/processors)

#### CodeParser
다양한 언어의 코드를 파싱하는 컴포넌트입니다.

```typescript
// src/processors/CodeParser.ts
export class CodeParser {
  public parse(code: string, language: string): any {
    switch (language) {
      case 'javascript':
      case 'typescript':
        return this.parseJSTS(code);
      case 'python':
        return this.parsePython(code);
      default:
        throw new Error(`Unsupported language: ${language}`);
    }
  }

  private parseJSTS(code: string): any {
    // JavaScript/TypeScript 파싱 로직
  }

  private parsePython(code: string): any {
    // Python 파싱 로직
  }
}
```

### 4. 통합 레이어 구현 (src/integrations)

#### FileSystemIntegration
파일 시스템 접근을 제공하는 통합 컴포넌트입니다.

```typescript
// src/integrations/FileSystemIntegration.ts
import * as fs from 'fs/promises';
import * as path from 'path';

export class FileSystemIntegration {
  private rootPath: string;

  constructor(rootPath: string) {
    this.rootPath = rootPath;
  }

  public async readFile(relativePath: string): Promise<string> {
    const fullPath = path.join(this.rootPath, relativePath);
    return fs.readFile(fullPath, 'utf-8');
  }

  public async writeFile(relativePath: string, content: string): Promise<void> {
    const fullPath = path.join(this.rootPath, relativePath);
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });
    return fs.writeFile(fullPath, content);
  }

  public async listFiles(relativePath: string): Promise<string[]> {
    const fullPath = path.join(this.rootPath, relativePath);
    const entries = await fs.readdir(fullPath, { withFileTypes: true });
    return entries.map(entry => entry.name);
  }
}
```

## 핵심 기능 구현 예시

### 코드 생성 기능

```typescript
// src/cli/commands/GenerateCommand.ts
import { AgentOrchestrator } from '../../agents/AgentOrchestrator';
import { FileSystemIntegration } from '../../integrations/FileSystemIntegration';

export class GenerateCommand {
  private agentOrchestrator: AgentOrchestrator;
  private fileSystem: FileSystemIntegration;

  constructor(agentOrchestrator: AgentOrchestrator, fileSystem: FileSystemIntegration) {
    this.agentOrchestrator = agentOrchestrator;
    this.fileSystem = fileSystem;
  }

  public async execute(spec: string, outputPath: string): Promise<void> {
    // 1. 에이전트에 코드 생성 요청
    const generatedCode = await this.agentOrchestrator.processRequest(`Generate code: ${spec}`);

    // 2. 생성된 코드를 파일에 저장
    await this.fileSystem.writeFile(outputPath, generatedCode);

    // 3. 결과 반환
    return {
      success: true,
      message: `Code generated and saved to ${outputPath}`,
      path: outputPath
    };
  }
}
```

## 테스트 전략

### 단위 테스트
각 컴포넌트의 개별 기능을 테스트합니다.

```typescript
// tests/agents/CodeGenerationAgent.test.ts
import { expect } from 'chai';
import { CodeGenerationAgent } from '../../src/agents/CodeGenerationAgent';
import { ContextManager } from '../../src/agents/ContextManager';

describe('CodeGenerationAgent', () => {
  let agent: CodeGenerationAgent;
  let contextManager: ContextManager;

  beforeEach(() => {
    contextManager = new ContextManager();
    agent = new CodeGenerationAgent(contextManager);
  });

  it('should generate valid JavaScript code', async () => {
    const spec = 'Create a function that adds two numbers';
    const code = await agent.generateCode(spec);

    expect(code).to.include('function');
    expect(code).to.include('return');
  });
});
```

### 통합 테스트
여러 컴포넌트 간의 상호작용을 테스트합니다.

```typescript
// tests/integration/CodeGeneration.test.ts
import { expect } from 'chai';
import { AgentOrchestrator } from '../../src/agents/AgentOrchestrator';
import { FileSystemIntegration } from '../../src/integrations/FileSystemIntegration';
import { GenerateCommand } from '../../src/cli/commands/GenerateCommand';

describe('Code Generation Flow', () => {
  let orchestrator: AgentOrchestrator;
  let fileSystem: FileSystemIntegration;
  let command: GenerateCommand;

  beforeEach(() => {
    // 테스트 설정
  });

  it('should generate code and save to file', async () => {
    // 테스트 로직
  });
});
```

## 성능 최적화 전략

1. **모델 호출 최적화**: 불필요한 AI 모델 호출 줄이기
2. **코드 캐싱**: 자주 사용되는 분석 결과 캐싱
3. **비동기 처리**: 장시간 실행 작업의 병렬 처리
4. **증분 분석**: 변경된 부분만 재분석

## 기여 가이드라인

1. 이슈 트래커에서 버그나 기능 요청 확인
2. 브랜치 만들기: `feature/feature-name` 또는 `fix/bug-name`
3. 코드 스타일 가이드 준수 (ESLint 구성 사용)
4. 풀 리퀘스트 생성 및 리뷰 대기
5. 승인 후 메인 브랜치에 병합
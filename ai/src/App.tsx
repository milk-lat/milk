import Header from './components/Header'
import Section from './components/Section'
import ConvolutionViz from './modules/ConvolutionViz'
import NeuralNetworkViz from './modules/NeuralNetworkViz'
import LanguageModelViz from './modules/LanguageModelViz'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Hero */}
      <section className="section-spacing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">AI</h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              现代简约风的 AI 可视化网站。适配手机端，模块化设计，便于未来扩展。
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              <a href="#conv" className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">卷积层</a>
              <a href="#nn" className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">神经网络</a>
              <a href="#lm" className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">语言模型</a>
            </div>
          </div>
        </div>
      </section>

      {/* Sections */}
      <Section
        id="conv"
        title="AI 卷积层可视化"
        description="演示卷积核在输入特征图上的滑动与运算过程，实时生成输出特征图。"
      >
        <ConvolutionViz />
      </Section>

      <Section
        id="nn"
        title="AI 神经网络可视化"
        description="展示多层全连接网络的结构与随机激活路径，辅助理解前向传播的信号流动。"
      >
        <NeuralNetworkViz />
      </Section>

      <Section
        id="lm"
        title="AI 语言模型可视化"
        description="以自回归注意力为例，动态呈现每个词对历史词的注意力权重分布。"
      >
        <LanguageModelViz />
      </Section>

      <footer className="mt-auto border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AI
        </div>
      </footer>
    </div>
  )
}

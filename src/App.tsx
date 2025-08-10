import Header from './components/Header'
import Section from './components/Section'
import ConvolutionViz from './modules/ConvolutionViz'
import NeuralNetworkViz from './modules/NeuralNetworkViz'
import LanguageModelViz from './modules/LanguageModelViz'
import ImageResolutionViz from './modules/ImageResolutionViz'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <section className="section-spacing">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-slate-900">AI</h1>
            <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
              以现代简约风呈现 AI 的核心概念与直觉：从卷积到神经网络、从注意力到分辨率。
            </p>
            <p className="mt-1 text-slate-500 text-sm max-w-2xl mx-auto">
              自适应手机端排版，模块化设计，便于持续扩展更多演示。
            </p>
            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              <a href="#conv" className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">卷积层</a>
              <a href="#nn" className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">神经网络</a>
              <a href="#lm" className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">语言模型</a>
              <a href="#img" className="px-4 py-2 rounded border border-slate-300 text-slate-700 hover:bg-slate-50">图片分辨率</a>
            </div>
          </div>
        </div>
      </section>

      <Section
        id="conv"
        title="AI 卷积层可视化"
        description="观察卷积核在输入特征图上的滑动窗口与局部感受野，理解卷积如何提取边缘/纹理等特征。"
      >
        <ConvolutionViz />
      </Section>

      <Section
        id="nn"
        title="AI 神经网络可视化"
        description="展示多层全连接网络的结构与随机激活路径，感受信号在不同层级的聚合与变换。"
      >
        <NeuralNetworkViz />
      </Section>

      <Section
        id="lm"
        title="AI 语言模型可视化"
        description="以自回归注意力为例，动态呈现每个词对历史词的注意力权重分布，理解上下文依赖。"
      >
        <LanguageModelViz />
      </Section>

      <Section
        id="img"
        title="AI 图片分辨率演示"
        description="对比原图与重采样后的像素化效果，直观理解分辨率变化对细节保留与观感的影响。"
      >
        <ImageResolutionViz />
      </Section>

      <footer className="mt-auto border-t border-slate-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} AI
        </div>
      </footer>
    </div>
  )
}

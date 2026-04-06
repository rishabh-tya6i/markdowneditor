import { useMemo, forwardRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useEditorStore } from '../store/useEditorStore';
import { useThemeStore } from '../store/useThemeStore';

const Preview = forwardRef<HTMLDivElement>((_, ref) => {
  const { content } = useEditorStore();
  const { currentTheme } = useThemeStore();
  
  const isDark = currentTheme.id.includes('dark') || currentTheme.id.includes('dracula') || currentTheme.id.includes('monokai');

  const components = useMemo(() => ({
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      return !inline && match ? (
        <SyntaxHighlighter
          style={isDark ? vscDarkPlus : prism}
          language={match[1]}
          PreTag="div"
          className="rounded-md !bg-transparent !p-0"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Custom header link rendering
    h1: (props: any) => <h1 id={props.id} className="scroll-mt-20 border-b border-border pb-2 mb-4" {...props} />,
    h2: (props: any) => <h2 id={props.id} className="scroll-mt-20 border-b border-border pb-1 mb-3" {...props} />,
    h3: (props: any) => <h3 id={props.id} className="scroll-mt-20" {...props} />,
  }), [isDark]);

  return (
    <div 
      ref={ref} 
      className="preview-container flex-1 h-full overflow-y-auto p-8 scroll-smooth"
      style={{ 
        backgroundColor: 'var(--editor-bg)',
        color: 'var(--editor-text)'
      }}
    >
      <div className="prose prose-slate dark:prose-invert max-w-none prose-pre:bg-sidebar/50 prose-pre:border prose-pre:border-border prose-headings:text-text prose-p:text-text prose-li:text-text prose-strong:text-text prose-code:text-accent prose-a:text-accent">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[
            rehypeRaw,
            rehypeSanitize,
            rehypeSlug,
            [rehypeAutolinkHeadings, { behavior: 'wrap' }]
          ]}
          components={components}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
});

Preview.displayName = 'Preview';
export default Preview;

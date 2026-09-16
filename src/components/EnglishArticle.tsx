import Link from "next/link";
export interface ArticleSection { title: string; paragraphs?: string[]; bullets?: string[]; table?: string[][]; }
export default function EnglishArticle({title, intro, sections, practice = "/en/", children}: {title: string; intro: string; sections: ArticleSection[]; practice?: string; children?: React.ReactNode}) {
 return <main className="min-h-screen bg-gradient-to-b from-gray-900 to-green-950 p-4 text-gray-200">
 <article className="max-w-2xl mx-auto py-8 leading-relaxed">
 <Link href="/en/guide/" className="text-sm text-yellow-300 underline">Guides & glossary</Link>
 <h1 className="text-3xl font-black text-white mt-4 mb-3">{title}</h1><p className="text-gray-400 mb-8">{intro}</p>
 <div className="space-y-8">{sections.map(section => <section key={section.title}>
 <h2 className="text-xl font-bold text-white mb-3">{section.title}</h2>
 {section.paragraphs?.map(p => <p key={p} className="mb-3 whitespace-pre-line">{p}</p>)}
 {section.bullets && <ul className="list-disc pl-6 space-y-2">{section.bullets.map(p => <li key={p}>{p}</li>)}</ul>}
 {section.table && <div className="overflow-x-auto"><table className="w-full text-sm text-left"><thead><tr>{section.table[0].map(h=><th key={h} className="p-2 bg-white/10">{h}</th>)}</tr></thead><tbody>{section.table.slice(1).map((row,i)=><tr key={i} className="border-b border-white/10">{row.map((cell,j)=><td key={j} className="p-2">{cell}</td>)}</tr>)}</tbody></table></div>}
 </section>)}</div>{children}
 <nav className="mt-10 flex flex-wrap gap-4"><Link href={practice} className="bg-yellow-400 text-gray-900 px-6 py-3 rounded-xl font-bold">Practice ⚔️</Link><Link href="/en/" className="px-4 py-3 underline">Home</Link></nav>
 </article></main>;
}

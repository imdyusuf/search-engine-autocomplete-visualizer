interface HighlightProps {
  text: string;
  query: string;
}

export function Highlight({ text, query }: HighlightProps) {
  const value = query.trim();
  if (!value) return <>{text}</>;
  const index = text.toLocaleLowerCase().indexOf(value.toLocaleLowerCase());
  if (index === -1) return <>{text}</>;
  return <>
    {text.slice(0, index)}
    <mark className="rounded bg-cyan-300/15 px-0.5 text-cyan-100">{text.slice(index, index + value.length)}</mark>
    {text.slice(index + value.length)}
  </>;
}
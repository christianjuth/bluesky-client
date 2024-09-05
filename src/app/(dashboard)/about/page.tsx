import Markdown from "markdown-to-jsx";

const markdown = `
# About

Really, this was just supposed to be a weekend project to help me test the latest Next.js features (e.g. [server actions](https://react.dev/reference/rsc/server-actions). 
I'm pretty happy with how this is turning out, so I may keep working on it.

### Goals:

- The site must be usable with JS disabled ([progressive enhancement](https://en.wikipedia.org/wiki/Progressive_enhancement))
- Aim for a Lighthouse performance score of 100 (95+ is acceptable)
- Support dark mode
- Be usable when you're not logged in
- Support mobile with minimal compromises

### Nice to have:
- Support for multiple languages

### Challenges:
- Enabling certain loading states in Next.js may negativly impact progressive enhancement

Cheers,<br/>
[Mose](http://localhost:3000/users/moseschrute.bsky.social)
`;

export default function Page() {
  return (
    <div className="prose prose-sm max-w-3xl mx-auto p-4 dark:prose-invert">
      <Markdown>{markdown}</Markdown>
    </div>
  );
}

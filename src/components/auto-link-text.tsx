import LinkifyIt from "linkify-it";
import Link from "next/link";
import * as routes from "@/lib/routes";
import tlds from "tlds";
import { ActorHoverCard } from "./actor-hover-card";

const linkify = new LinkifyIt();

linkify.tlds(tlds);

linkify.add("@", {
  validate: function (text, pos, self) {
    const tail = text.slice(pos);

    if (!self.re.bsky) {
      self.re.bsky = new RegExp(
        "^([a-zA-Z0-9_.]){1,30}(?!\\.)(?=$|" + self.re.src_ZPCc + ")",
      );
    }
    if (self.re.bsky.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === "@") {
        return false;
      }
      return tail.match(self.re.bsky)![0].length;
    }
    return 0;
  },
  normalize: function (match) {
    const handle = match.url.replace(/^@/, "");
    match.url = routes.user(handle);
  },
});

linkify.add("#", {
  validate: function (text, pos, self) {
    const tail = text.slice(pos);

    if (!self.re.twitter) {
      self.re.twitter = new RegExp(
        "^([a-zA-Z0-9_]){1,20}(?!_)(?=$|" + self.re.src_ZPCc + ")",
      );
    }
    if (self.re.twitter.test(tail)) {
      // Linkifier allows punctuation chars before prefix,
      // but we additionally disable `@` ("@@mention" is invalid)
      if (pos >= 2 && tail[pos - 2] === "#") {
        return false;
      }
      return tail.match(self.re.twitter)![0].length;
    }
    return 0;
  },
  normalize: function (match) {
    const hashtag = match.url.replace(/^#/, "");
    match.url = routes.searchHashtags(hashtag);
  },
});

export function AutoLinkText({ children }: { children: string }) {
  const matches = linkify.match(children) ?? [];

  let output: React.ReactNode[] = [];

  let i = 0;
  for (const match of matches) {
    output.push(children.slice(i, match.index));

    switch (match.schema) {
      case "@":
        const handleWithoutAt = match.text.slice(1);
        output.push(
          <ActorHoverCard key={i} actor={{ handle: handleWithoutAt }}>
            <Link key={i} href={match.url} className="text-highlight">
              {match.text}
            </Link>
          </ActorHoverCard>,
        );
        break;
      case "#":
        output.push(
          <Link key={i} href={match.url} className="text-highlight">
            {match.text}
          </Link>,
        );
        break;
      default:
        output.push(
          <a
            key={i}
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-highlight hover:underline"
          >
            {match.text.replace(/^https?:\/\//, "")}
          </a>,
        );
        break;
    }
    i = match.lastIndex;
  }

  output.push(children.substring(i));

  return <>{output}</>;
}

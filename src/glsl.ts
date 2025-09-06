import { LanguageSupport, LRLanguage } from "@codemirror/language";
import { parser as glslParser } from "lezer-glsl"
import { styleTags, tags as t } from "@lezer/highlight";
import { autocompletion } from "@codemirror/autocomplete";
import glslCompletionSource from "./completion";

const language = LRLanguage.define({
    parser: glslParser as any,
    languageData: {
        commentTokens: { line: "//", block: { open: "/*", close: "*/" } },
    }
});

const glslHighlight = language.configure({
    props: [
        styleTags({
            "precision const uniform in out centroid layout smooth flat invariant highp mediump lowp": t.keyword,
        })
    ]
});

export function glsl(): LanguageSupport {
    return new LanguageSupport(glslHighlight, [autocompletion({ override: [glslCompletionSource] })]);
}

export default glsl;

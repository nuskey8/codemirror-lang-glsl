# @nuskey8/codemirror-lang-glsl

This library provides the GLSL language support implementation for CodeMirror.

## Usage

```ts
import {EditorView, basicSetup} from "codemirror"
import {glsl} from "@nuskey8/codemirror-lang-glsl"

const view = new EditorView({
  parent: document.body,
  doc: `precision mediump float;

void main(void) {
	gl_FragColor = vec4(1.0);
}`,
  extensions: [basicSetup, glsl()]
})
```

## API Reference

* `glsl(): LanguageSupport` 
    GLSL support, including completion for global variables, keywords, built-in variables and functions.
* `glslCompletionSource(ctx: CompletionContext): CompletionResult | null`
    Returns a completion source for GLSL.

## License

This library is licensed under the [MIT License](./LICENSE).






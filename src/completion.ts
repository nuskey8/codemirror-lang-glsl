import { CompletionContext, Completion, CompletionResult } from "@codemirror/autocomplete";

const glslKeywords = [
    "precision", "const", "uniform", "in", "out", "attribute", "varying", "layout",
    "break", "continue", "do", "for", "while", "if", "else", "return", "discard",
    "struct", "void", "bool", "int", "float", "double",
    "vec2", "vec3", "vec4", "ivec2", "ivec3", "ivec4", "bvec2", "bvec3", "bvec4",
    "mat2", "mat3", "mat4", "sampler2D", "samplerCube", "sampler3D", "centroid",
    "smooth", "flat", "invariant", "highp", "mediump", "lowp"
];

const glslBuiltins = [
    'radians', 'degrees', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'pow', 'exp', 'log', 'exp2', 'log2', 'sqrt', 'inversesqrt',
    'abs', 'sign', 'floor', 'ceil', 'fract', 'mod', 'min', 'max', 'clamp', 'mix', 'step', 'smoothstep', 'length', 'distance', 'dot', 'cross', 'normalize',
    'faceforward', 'reflect', 'refract', 'matrixCompMult', 'lessThan', 'lessThanEqual', 'greaterThan', 'greaterThanEqual', 'equal', 'notEqual',
    'any', 'all', 'not', 'texture', 'texture2D', 'textureCube', 'textureProj', 'textureLod', 'textureOffset', 'dFdx', 'dFdy', 'fwidth',
    'emitVertex', 'endPrimitive', 'gl_Position', 'gl_PointSize', 'gl_FragCoord', 'gl_PointCoord', 'gl_FrontFacing', 'gl_FragColor', 'gl_FragData', 'gl_MaxDrawBuffers',
    'gl_VertexID', 'gl_InstanceID', 'gl_FragDepth',
];

export function glslCompletionSource(ctx: CompletionContext): CompletionResult | null {
    // Match current token (identifier)
    const word = ctx.matchBefore(/[A-Za-z_]\w*/);
    if (!word) return null;
    // If not explicit and empty, don't show
    if (word.from == word.to && !ctx.explicit) return null;

    const q = word.text;
    const doc = ctx.state.doc.toString();

    // Gather declared identifiers from the document
    const decls = new Set<string>();
    // common storage/qualifier + type + name patterns
    const declRegex = /(?:uniform|const|in|out|attribute|varying)\s+(?:lowp|mediump|highp)?\s*[A-Za-z_]\w*\s+([A-Za-z_]\w*)/g;
    let m: RegExpExecArray | null;
    while ((m = declRegex.exec(doc))) {
        decls.add(m[1]);
    }

    // Direct type declarations like: float value;
    const typeRegex = /\b(?:float|int|bool|vec[2-4]|mat[2-4]|sampler2D|samplerCube|sampler3D)\b\s+([A-Za-z_]\w*)/g;
    while ((m = typeRegex.exec(doc))) {
        decls.add(m[1]);
    }

    // Function declarations: returnType name(...)
    const funcRegex = /(?:\bvoid\b|\bfloat\b|\bint\b|\bbool\b|vec[2-4]|mat[2-4]|[A-Za-z_]\w*)\s+([A-Za-z_]\w*)\s*\(/g;
    while ((m = funcRegex.exec(doc))) {
        decls.add(m[1]);
    }

    const options: Completion[] = [];

    const pushIf = (label: string, type: string) => {
        if (label.toLowerCase().startsWith(q.toLowerCase())) {
            options.push({ label, type });
        }
    };

    for (const k of glslKeywords) pushIf(k, "keyword");
    for (const b of glslBuiltins) pushIf(b, "function");
    for (const d of decls) pushIf(d, "variable");

    return { from: word.from, options };
}

export default glslCompletionSource;

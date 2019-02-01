/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { Editor, getEventRange, getEventTransfer } from 'slate-react';
import { Value, Block } from 'slate';
import Plain from 'slate-plain-serializer';
import { isKeyHotkey } from 'is-hotkey';
import isUrl from 'is-url';
import { themes } from '../base/themes';
import SoftBreak from 'slate-soft-break';
import swal from 'sweetalert';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

const plugins = [
    SoftBreak({
        shift: true,
    }),
];

const Vertical = () => (
    <div css={css`
        background-color: ${themes.standard.lightgray};
        width: 1px;
        height: 7px;
    `}/>
);

const Image = ({ src }) => (
    <img alt="" src={src}/>
);

const Toolbar = ({ children }) => (
    <div className="te-toolbar" css={css`
        margin-bottom: 1em;

        & > * {
            display: inline-block;
        }

        & > * + * {
            margin-left: 5px;
        }
    `}>
        {children}
    </div>
);

const Button = ({ children, active, onMouseDown }) => (
    <span className="te-button" css={css`
        cursor: pointer;
        color: ${active ? themes.standard.secondary : themes.standard.gray};
        padding: .25em;
        font-size: .75em;
    `} onMouseDown={onMouseDown}>
        {children}
    </span>
);

class LanguageChoices extends Component {
    render () {
        return (
            <div css={css`
                position: absolute;
                top: 0;
                right: 0;
            `}>
                <select value={this.props.choice ? this.props.choice : 'clike'} onChange={this.props.onChange}>
                    <option value="abap">ABAP</option>
                    <option value="actionscript">ActionScript</option>
                    <option value="ada">Ada</option>
                    <option value="apacheconf">Apache Configuration</option>
                    <option value="apl">APL</option>
                    <option value="applescript">AppleScript</option>
                    <option value="arduino">Arduino</option>
                    <option value="arff">ARFF</option>
                    <option value="asciidoc">AsciiDoc</option>
                    <option value="asm6502">6502 Assembly</option>
                    <option value="aspnet">ASP.NET (C#)</option>
                    <option value="autohotkey">AutoHotkey</option>
                    <option value="autoit">AutoIt</option>
                    <option value="bash">Bash</option>
                    <option value="basic">BASIC</option>
                    <option value="batch">Batch</option>
                    <option value="bison">Bison</option>
                    <option value="brainfuck">Brainfuck</option>
                    <option value="bro">Bro</option>
                    <option value="c">C</option>
                    <option value="cil">CIL</option>
                    <option value="clike">C-like</option>
                    <option value="clojure">Clojure</option>
                    <option value="coffeescript">CoffeeScript</option>
                    <option value="cpp">C++</option>
                    <option value="crystal">Crystal</option>
                    <option value="csharp">C#</option>
                    <option value="csp">Content-Security-Policy</option>
                    <option value="css">CSS</option>
                    <option value="d">D</option>
                    <option value="dart">Dart</option>
                    <option value="diff">Diff</option>
                    <option value="django">Django/Jinja2</option>
                    <option value="docker">Docker</option>
                    <option value="eiffel">Eiffel</option>
                    <option value="elixir">Elixir</option>
                    <option value="elm">Elm</option>
                    <option value="erb">ERB</option>
                    <option value="erlang">Erlang</option>
                    <option value="flow">Flow</option>
                    <option value="fortran">Fortran</option>
                    <option value="fsharp">F#</option>
                    <option value="gcode">G-code</option>
                    <option value="gedcom">GEDCOM</option>
                    <option value="gherkin">Gherkin</option>
                    <option value="git">Git</option>
                    <option value="glsl">GLSL</option>
                    <option value="gml">GameMaker Language</option>
                    <option value="go">Go</option>
                    <option value="graphql">GraphQL</option>
                    <option value="groovy">Groovy</option>
                    <option value="haml">Haml</option>
                    <option value="handlebars">Handlebars</option>
                    <option value="haskell">Haskell</option>
                    <option value="haxe">Haxe</option>
                    <option value="hcl">HCL</option>
                    <option value="hpkp">HTTP Public-Key-Pins</option>
                    <option value="hsts">HTTP Strict-Transport-Security</option>
                    <option value="http">HTTP</option>
                    <option value="ichigojam">IchigoJam</option>
                    <option value="icon">Icon</option>
                    <option value="inform7">Inform 7</option>
                    <option value="ini">Ini</option>
                    <option value="io">Io</option>
                    <option value="j">J</option>
                    <option value="java">Java</option>
                    <option value="javascript">JavaScript</option>
                    <option value="javastacktrace">Java stack trace</option>
                    <option value="jolie">Jolie</option>
                    <option value="json">JSON</option>
                    <option value="jsx">React JSX</option>
                    <option value="julia">Julia</option>
                    <option value="keyman">Keyman</option>
                    <option value="kotlin">Kotlin</option>
                    <option value="latex">LaTeX</option>
                    <option value="less">Less</option>
                    <option value="liquid">Liquid</option>
                    <option value="lisp">Lisp</option>
                    <option value="livescript">LiveScript</option>
                    <option value="lolcode">LOLCODE</option>
                    <option value="lua">Lua</option>
                    <option value="makefile">Makefile</option>
                    <option value="markdown">Markdown</option>
                    <option value="markup">Markup</option>
                    <option value="markup-templating">Markup templating</option>
                    <option value="matlab">MATLAB</option>
                    <option value="mel">MEL</option>
                    <option value="mizar">Mizar</option>
                    <option value="monkey">Monkey</option>
                    <option value="n1ql">N1QL</option>
                    <option value="n4js">N4JS</option>
                    <option value="nand2tetris-hdl">Nand To Tetris HDL</option>
                    <option value="nasm">NASM</option>
                    <option value="nginx">nginx</option>
                    <option value="nim">Nim</option>
                    <option value="nix">Nix</option>
                    <option value="nsis">NSIS</option>
                    <option value="objectivec">Objective-C</option>
                    <option value="ocaml">OCaml</option>
                    <option value="opencl">OpenCL</option>
                    <option value="oz">Oz</option>
                    <option value="parigp">PARI/GP</option>
                    <option value="parser">Parser</option>
                    <option value="pascal">Pascal</option>
                    <option value="perl">Perl</option>
                    <option value="php">PHP</option>
                    <option value="plsql">PL/SQL</option>
                    <option value="powershell">PowerShell</option>
                    <option value="processing">Processing</option>
                    <option value="prolog">Prolog</option>
                    <option value="properties">.properties</option>
                    <option value="protobuf">Protocol Buffers</option>
                    <option value="pug">Pug</option>
                    <option value="puppet">Puppet</option>
                    <option value="pure">Pure</option>
                    <option value="python">Python</option>
                    <option value="q">Q (kdb+ database)</option>
                    <option value="qore">Qore</option>
                    <option value="r">R</option>
                    <option value="reason">Reason</option>
                    <option value="renpy">Ren'py</option>
                    <option value="rest">reST (reStructuredText)</option>
                    <option value="rip">Rip</option>
                    <option value="roboconf">Roboconf</option>
                    <option value="ruby">Ruby</option>
                    <option value="rust">Rust</option>
                    <option value="sas">SAS</option>
                    <option value="sass">Sass (Sass)</option>
                    <option value="scala">Scala</option>
                    <option value="scheme">Scheme</option>
                    <option value="scss">Sass (Scss)</option>
                    <option value="smalltalk">Smalltalk</option>
                    <option value="smarty">Smarty</option>
                    <option value="soy">Soy (Closure Template)</option>
                    <option value="sql">SQL</option>
                    <option value="stylus">Stylus</option>
                    <option value="swift">Swift</option>
                    <option value="tap">TAP</option>
                    <option value="tcl">Tcl</option>
                    <option value="textile">Textile</option>
                    <option value="toml">TOML</option>
                    <option value="tsx">React TSX</option>
                    <option value="tt2">Template Toolkit 2</option>
                    <option value="twig">Twig</option>
                    <option value="typescript">TypeScript</option>
                    <option value="vala">Vala</option>
                    <option value="vbnet">VB.Net</option>
                    <option value="velocity">Velocity</option>
                    <option value="verilog">Verilog</option>
                    <option value="vhdl">VHDL</option>
                    <option value="vim">vim</option>
                    <option value="visual-basic">Visual Basic</option>
                    <option value="wasm">WebAssembly</option>
                    <option value="wiki">Wiki markup</option>
                    <option value="xeora">Xeora</option>
                    <option value="xojo">Xojo (REALbasic)</option>
                    <option value="xquery">XQuery</option>
                    <option value="yaml">YAML</option>
                </select>
            </div>
        );
    }
}

export default class TextEditor extends Component {
    state = {
        value: (this.props.plaintext ?
            Plain.deserialize(this.props.value == null ? '' : this.props.value) :
            Value.fromJSON(this.props.value)),
    };

    schema = {
        blocks: {
            image: {
                isVoid: true,
            },
        },
    };

    onChange = ({ value }) => {
        if (this.props.plaintext) {
            this.props.onChange(Plain.serialize(value));
        } else {
            this.props.onChange(JSON.stringify(value));
        }

        this.setState({ value });
    }

    hasMark = type => {
        const { value } = this.state;
        return value.activeMarks.some(mark => mark.type === type);
    }

    hasBlock = type => {
        const { value } = this.state;
        return value.blocks.some(node => node.type === type);
    }

    renderMark = (props, editor, next) => {
        const { children, mark, attributes } = props;

        switch (mark.type) {
            case 'bold':
                return <strong {...attributes}>{children}</strong>
            case 'code':
                return <code {...attributes}>{children}</code>
            case 'italic':
                return <em {...attributes}>{children}</em>
            case 'underlined':
                return <u {...attributes}>{children}</u>
            case 'link':
                return <a {...attributes} href={mark.data.get('href')}>{children}</a>
            default:
                return next();
        }
    }

    renderNode = (props, editor, next) => {
        const { attributes, children, node } = props;

        switch (node.type) {
            case 'block-quote':
                return <blockquote {...attributes}>{children}</blockquote>
            case 'pre-code':
                return (
                    <div css={css`
                        position: relative;
                    `}>
                        <LanguageChoices choice={node.data.get('language')} onChange={(e) => {
                            editor.setNodeByKey(
                                node.key,
                                new Block({
                                    data: node.data.set('language', e.target.value),
                                    key: node.key,
                                    object: 'block',
                                    nodes: node.nodes,
                                    type: node.type,
                                })
                            );
                        }}/>

                        <pre {...attributes} language={node.data.get('language')}>
                            <code>{children}</code>
                        </pre>
                    </div>
                );
            case 'bulleted-list':
                return <ul {...attributes}>{children}</ul>
            case 'heading-one':
                return <h1 {...attributes}>{children}</h1>
            case 'heading-two':
                return <h2 {...attributes}>{children}</h2>
            case 'heading-three':
                return <h3 {...attributes}>{children}</h3>
            case 'heading-four':
                return <h4 {...attributes}>{children}</h4>
            case 'heading-five':
                return <h5 {...attributes}>{children}</h5>
            case 'heading-six':
                return <h6 {...attributes}>{children}</h6>
            case 'list-item':
                return <li {...attributes}>{children}</li>
            case 'numbered-list':
                return <ol {...attributes}>{children}</ol>
            case 'image':
                const src = node.data.get('src');
                return <Image src={src} {...attributes}/>
            default:
                return next();
        }
    }

    onClickMark = (event, type) => {
        event.preventDefault();
        this.editor.toggleMark(type);

        if (type === 'link') {
            this.onClickLink(event);
        }
    }

    renderMarkButton = (type, char) => {
        const isActive = this.hasMark(type);

        return (
            <Button
                active={isActive}
                onMouseDown={event => this.onClickMark(event, type) }
            >
                <span css={css`
                    font-family: 'Avenir Next';
                    font-weight: 400;
                    font-size: 10px;
                `}>
                    {char}
                </span>
            </Button>
        );
    }

    renderBlockButton = (type, char) => {
        let isActive = this.hasBlock(type);

        if (['numbered-list', 'bulleted-list'].includes(type)) {
            const { value: { document, blocks } } = this.state

            if (blocks.size > 0) {
                const parent = document.getParent(blocks.first().key)
                isActive = this.hasBlock('list-item') && parent && parent.type === type
            }
        }

        return (
            <Button
                active={isActive}
                onMouseDown={event => this.onClickBlock(event, type)}
            >
                <span css={css`
                    font-family: 'Avenir Next';
                    font-weight: 400;
                    font-size: 10px;
                `}>
                    {char}
                </span>

            </Button>
        );
    }

    onClickBlock = (event, type) => {
        event.preventDefault();

        const { editor } = this;
        const { value } = editor;
        const { document } = value;

        // Handle everything but list buttons.
        if (type !== 'bulleted-list' && type !== 'numbered-list') {
            const isActive = this.hasBlock(type);
            const isList = this.hasBlock('list-item');

            if (isList) {
                editor
                    .setBlocks(isActive ? 'paragraph' : type)
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list');
            } else {
                editor.setBlocks(isActive ? 'paragraph' : type);
            }
        } else {
            // Handle the extra wrapping required for list buttons.
            const isList = this.hasBlock('list-item');
            const isType = value.blocks.some(block => {
                return !!document.getClosest(block.key, parent => parent.type === type);
            });

            if (isList && isType) {
                editor
                    .setBlocks('paragraph')
                    .unwrapBlock('bulleted-list')
                    .unwrapBlock('numbered-list');
            } else if (isList) {
                editor
                .unwrapBlock(
                    type === 'bulleted-list' ? 'numbered-list' : 'bulleted-list'
                )
                .wrapBlock(type);
            } else {
                editor.setBlocks('list-item').wrapBlock(type);
            }
        }
    }

    onKeyDown = (event, editor, next) => {
        if (this.props.plaintext) {
            return next();
        }

        let mark;

        if (isBoldHotkey(event)) {
            mark = 'bold';
        } else if (isItalicHotkey(event)) {
            mark = 'italic';
        } else if (isUnderlinedHotkey(event)) {
            mark = 'underlined';
        } else if (isCodeHotkey(event)) {
            mark = 'code';
        } else {
            switch (event.key) {
                case ' ':
                    return this.onSpace(event, editor, next);
                case 'Backspace':
                    return this.onBackspace(event, editor, next);
                case 'Enter':
                    return this.onEnter(event, editor, next);
                default:
                    return next();
            }
        }

        event.preventDefault();
        editor.toggleMark(mark);
    }

    onSpace = (event, editor, next) => {
        const { value } = editor;
        const { selection } = value;

        if (selection.isExpanded) {
            return next();
        }

        const { startBlock } = value;
        const { start } = selection;
        const chars = startBlock.text.slice(0, start.offset).replace(/\s*/g, '');
        const type = this.getType(chars);

        if (!type) {
            return next();
        }

        if (type === 'list-item' && startBlock.type === 'list-item') {
            return next();
        }

        event.preventDefault();
        editor.setBlocks(type);

        if (type === 'list-item') {
            editor.wrapBlock('bulleted-list');
        }

        editor.moveFocusToStartOfNode(startBlock).delete();
    }

    insertImage = (editor, src, target) => {
        if (target) {
            editor.select(target);
        }

        editor.insertBlock({
            type: 'image',
            data: { src },
        });
    }

    onDropOrPaste = (event, editor, next) => {
        const target = getEventRange(event, editor);
        if (!target && event.type === 'drop') {
            return next();
        }

        const transfer = getEventTransfer(event);
        const { type, files } = transfer;

        if (type === 'files') {
            for (const file of files) {
                const reader = new FileReader();
                const [mime] = file.type.split('/');
                if (mime !== 'image') {
                    continue;
                }

                reader.addEventListener('load', () => {
                    editor.command(this.insertImage, reader.result, target);
                });

                reader.readAsDataURL(file);
            }

            return;
        }

        next();
    }

    hasLinks = () => {
        const { value } = this.state;
        return value.inlines.some(inline => inline.type === 'link');
    }

    onPaste = (event, editor, next) => {
        if (editor.value.selection.isCollapsed) {
            return next();
        }

        const transfer = getEventTransfer(event);
        const { type, text } = transfer;

        if (type !== 'text' && type !== 'html') {
            return next();
        }

        if (!isUrl(text)) {
            return next();
        }

        editor.command(this.wrapLink, text);
    }

    wrapLink = (editor, href) => {
        editor.replaceMark(
            'link',
            {
                type: 'link',
                data: { href },
            }
        );

        editor.moveToEnd();
    }

    onClickLink = async (event) => {
        event.preventDefault();

        const { editor } = this;
        const { value } = editor;
        const hasLinks = this.hasLinks();

        if (hasLinks) {
            // ..
        } else if (value.selection.isExpanded) {
            const href = window.prompt('Enter the URL of the link:');

            if (href === null) {
                return;
            }

            editor.command(this.wrapLink, href);
        } else {
            const href = await swal("Enter the URL of the link:", {
                content: "input",
            });

            if (href === null) {
                return;
            }

            const text = await swal("Enter the text for the link:", {
                content: "input",
            });

            if (text === null) {
                return;
            }

            editor
                .insertText(text)
                .moveFocusBackward(text.length)
                .command(this.wrapLink, href);
        }
    }

    onBackspace = (event, editor, next) => {
        const { value } = editor;
        const { selection } = value;
        if (selection.isExpanded) {
            return next();
        }

        if (selection.start.offset !== 0) {
            return next();
        }

        const { startBlock } = value;
        if (startBlock.type === 'paragraph') {
            return next();
        }

        event.preventDefault();
        editor.setBlocks('paragraph');

        if (startBlock.type === 'list-item') {
            editor.unwrapBlock('bulleted-list');
        }
    }

    onEnter = (event, editor, next) => {
        const { value } = editor;
        const { selection } = value;
        const { start, end, isExpanded } = selection;

        if (isExpanded) {
            return next();
        }

        const { startBlock } = value;
        if (start.offset === 0 && startBlock.text.length === 0) {
            return this.onBackspace(event, editor, next);
        }

        if (end.offset !== startBlock.text.length) {
            return next();
        }

        if (startBlock.type === 'pre-code') {
            return next();
        }

        if (
            startBlock.type !== 'heading-one' &&
            startBlock.type !== 'heading-two' &&
            startBlock.type !== 'heading-three' &&
            startBlock.type !== 'heading-four' &&
            startBlock.type !== 'heading-five' &&
            startBlock.type !== 'heading-six' &&
            startBlock.type !== 'block-quote'
        ) {
            return next();
        }

        event.preventDefault();
        editor.splitBlock().setBlocks('paragraph');
    }

    ref = editor => {
        this.editor = editor;
    }

    getType = chars => {
        switch (chars) {
            case '*':
            case '-':
            case '+':
                return 'list-item';
            case '>':
                return 'block-quote';
            case '#':
                return 'heading-one';
            case '##':
                return 'heading-two';
            case '###':
                return 'heading-three';
            case '####':
                return 'heading-four';
            case '#####':
                return 'heading-five';
            case '######':
                return 'heading-six';
            case '```':
                return 'pre-code';
            default:
                return null;
        }
    }

    render() {
        const toolbar = this.props.toolbar ? (
            <Toolbar>
                {this.renderMarkButton('bold', 'B')}
                {this.renderMarkButton('italic', 'I')}
                {this.renderMarkButton('underlined', 'U')}
                {this.renderMarkButton('code', '</>')}
                {this.renderMarkButton('link', '<A>')}
                <Vertical/>
                {this.renderBlockButton('heading-one', 'H1')}
                {this.renderBlockButton('heading-two', 'H2')}
                {this.renderBlockButton('heading-three', 'H3')}
                {this.renderBlockButton('block-quote', '“!“')}
                {this.renderBlockButton('pre-code', '<\\>')}
                <Vertical/>
                {this.renderBlockButton('numbered-list', 'OL')}
                {this.renderBlockButton('bulleted-list', 'UL')}
            </Toolbar>
        ) : '';

        return (
            <div className="te-wrapper" css={css`
                overflow: auto;

                h1 {
                    font-size: 2em;
                }

                h2 {
                    font-size: 1.75em;
                }

                h3 {
                    font-size: 1.5em;
                }

                blockquote {
                    border-left: 5px solid ${themes.standard.gray};
                    padding-left: 1em;

                }

                ul {
                    list-style-type: disc;
                    margin: 0 1em;
                }

                ol {
                    list-style-type: decimal;
                    margin: 0 1em;
                }

                strong {
                    font-weight: bold;
                }

                em {
                    font-style: italic;
                }

                u {
                    text-decoration: underline;
                }

                code {
                    font-family: monospace;
                }

                img {
                    max-width: 100%;
                }

                pre {
                    background-color: ${themes.standard.lightgray};
                    padding: 1em;
                }
            `}>
                {toolbar}

                <div className="te-editor">
                    <Editor
                        ref={this.ref}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        onDrop={this.onDropOrPaste}
                        onPaste={this.onPaste}
                        value={this.state.value}
                        schema={this.schema}
                        renderNode={this.renderNode}
                        renderMark={this.renderMark}
                        placeholder={this.props.placeholder}
                        plugins={plugins}
                    />
                </div>
            </div>
        )
    }
}
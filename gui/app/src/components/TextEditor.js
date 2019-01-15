/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { Editor } from 'slate-react';
import { Value } from 'slate';
import Plain from 'slate-plain-serializer';
import { isKeyHotkey } from 'is-hotkey';
import { themes } from '../base/themes';

const isBoldHotkey = isKeyHotkey('mod+b');
const isItalicHotkey = isKeyHotkey('mod+i');
const isUnderlinedHotkey = isKeyHotkey('mod+u');
const isCodeHotkey = isKeyHotkey('mod+`');

const Vertical = () => (
    <div css={css`
        background-color: ${themes.standard.lightgray};
        width: 1px;
        height: 7px;
    `}/>
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

export default class TextEditor extends Component {
    state = {
        value: (this.props.plaintext ?
            Plain.deserialize(this.props.value) :
            Value.fromJSON(this.props.value)),
    }

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
            default:
                return next();
        }
    }

    renderNode = (props, editor, next) => {
        const { attributes, children, node } = props;

        switch (node.type) {
            case 'block-quote':
                return <blockquote {...attributes}>{children}</blockquote>
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
            default:
                return next();
        }
    }

    onClickMark = (event, type) => {
        event.preventDefault();
        this.editor.toggleMark(type);
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
                <Vertical/>
                {this.renderBlockButton('heading-one', 'H1')}
                {this.renderBlockButton('heading-two', 'H2')}
                {this.renderBlockButton('heading-three', 'H3')}
                {this.renderBlockButton('block-quote', '“!“')}
                <Vertical/>
                {this.renderBlockButton('numbered-list', 'OL')}
                {this.renderBlockButton('bulleted-list', 'UL')}
            </Toolbar>
        ) : '';

        return (
            <div className="te-wrapper" css={css`
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
            `}>
                {toolbar}

                <div className="te-editor">
                    <Editor
                        ref={this.ref}
                        onChange={this.onChange}
                        onKeyDown={this.onKeyDown}
                        value={this.state.value}
                        renderNode={this.renderNode}
                        renderMark={this.renderMark}
                        placeholder={this.props.placeholder}
                    />
                </div>
            </div>
        )
    }
}

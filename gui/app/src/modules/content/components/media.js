/** @jsx jsx */
import { jsx, css } from '@emotion/core';
import { Component } from 'react';
import { connect } from 'react-redux';

import Dropzone from 'react-dropzone';
import { Button } from '../../../components/Button';

import {
    fetchMediaIfNeeded,
} from '../actions/media/';

class Media extends Component {
    constructor() {
        super();

        this.onDrop = (files) => {
            this.setState({files});
        };

        this.state = {
            files: [],
        };
    }

    componentDidMount () {
        const { dispatch } = this.props;
        dispatch(fetchMediaIfNeeded());
    }

    copyToClipboard = (text) => {
        let textField = document.createElement('textarea');
        textField.innerText = text;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
    }

    url = () => {
        return this.props.settings.map((k) => {
            if (k.key === 'url') {
                return k.value;
            }

            return null;
        }).filter(Boolean)[0];
    }

    upload = () => {
        console.log(this.state.files);
    }

    render() {
        const files = this.state.files.map(file => (
            <li key={file.name} css={css`
                padding: .5em;
            `}>
                {file.name} - {file.size} bytes
            </li>
        ));

        const { items } = this.props;
  
        return (
            <div>
                <div css={css`
                    margin: 1em;
                `}>
                    <Dropzone onDrop={this.onDrop}>
                        {({getRootProps, getInputProps}) => (
                            <section className="container">
                                <div {...getRootProps({className: 'dropzone'})} css={css`
                                    padding: 20px;
                                    border-width: 2px;
                                    border-color: #EEE;
                                    border-style: dashed;
                                    background-color: #fafafa;
                                    color: #bdbdbd;
                                    outline: none;
                                    transition: border .24s ease-in-out;        
                                `}>
                                    <input {...getInputProps()} />
                                    <p>Drag 'n' drop some files here.</p>
                                </div>
                                <aside css={css`
                                    margin-top: 1em;
                                `}>
                                {files.length > 0 ? (
                                        <div>
                                            <h4>Files</h4>
                                            <ul>{files}</ul>
                                            <Button onClick={this.upload}>Upload</Button>
                                        </div>
                                    ) : ''}
                                </aside>
                            </section>
                        )}
                    </Dropzone>
                </div>
                <div css={css`
                    margin: 1em;
                    margin-top: 3em;

                    h2 {
                        font-size: 1.5em;
                    }
                `}>
                    <h2>Media Gallery</h2>
                    <div css={css`
                        margin: 1em 0;

                        img {
                            padding: .25em;

                            &:hover {
                                -webkit-filter: brightness(.5);
                                filter: brightness(.5);
                                cursor: pointer;
                            }
                        }

                        p {
                            visibility: hidden;
                            position: absolute;
                            top: 50%;
                            transform: translateY(-50%);
                            color: #FFF;
                            width: 100px;
                            text-align: center;
                            z-index: 99px;
                            padding: .25em;
                            line-height: 1.5em;
                            pointer-events: none;
                        }
                    `}>
                        {items ? items.map(media => (
                            <div key={media.id} css={css`
                                display: inline-block;
                                position: relative;

                                &:hover {
                                    p {
                                        visibility: visible;
                                    }
                                }
                            `}>
                                <img
                                    onClick={e => this.copyToClipboard(e.target.src)}
                                    src={`${this.url()}/s/__media/${media.file}`}
                                    width="100" height="100"
                                    alt={media.file}/>
                                <p>Click to copy URL</p>
                            </div>
                        )) : ''}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    loaded: state.posts.loaded,
    error: state.posts.error,
    items: state.media.items,
    settings: state.settings.items,
});

export default connect(mapStateToProps)(Media);

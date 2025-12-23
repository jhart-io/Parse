"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { EditorState } from "lexical";
import {
  BOLD_ITALIC_STAR,
  BOLD_STAR,
  BOLD_UNDERSCORE,
  ITALIC_STAR,
  ITALIC_UNDERSCORE,
  STRIKETHROUGH,
  $convertToMarkdownString,
  $convertFromMarkdownString,
} from "@lexical/markdown";

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  className?: string;
}

// Text format transformers for basic markdown shortcuts
const TEXT_FORMAT_TRANSFORMERS = [
  BOLD_ITALIC_STAR, // ***text*** - must come before BOLD_STAR
  BOLD_STAR, // **text**
  BOLD_UNDERSCORE, // __text__
  ITALIC_STAR, // *text*
  ITALIC_UNDERSCORE, // _text_
  STRIKETHROUGH, // ~~text~~
];

export default function MarkdownEditor({
  value = "",
  onChange,
  placeholder = "Type something...",
  className = "",
}: MarkdownEditorProps) {
  const handleChange = (editorState: EditorState) => {
    editorState.read(() => {
      // Convert the editor state to markdown format
      const markdown = $convertToMarkdownString(TEXT_FORMAT_TRANSFORMERS);
      onChange?.(markdown);
    });
  };

  return (
    <LexicalComposer
      initialConfig={{
        namespace: "MarkdownEditor",
        theme: {
          text: {
            bold: "font-bold",
            italic: "italic",
            strikethrough: "line-through",
            underline: "underline",
          },
        },
        onError: (error: Error) => {
          console.error("Editor error:", error);
        },
        editorState: () =>
          $convertFromMarkdownString(value, TEXT_FORMAT_TRANSFORMERS),
      }}
    >
      <div className={`relative ${className}`}>
        <RichTextPlugin
          contentEditable={
            <ContentEditable
              className="outline-none min-h-[100px] p-3 prose prose-sm max-w-none"
              aria-placeholder={placeholder}
              placeholder={
                <div className="absolute top-3 left-3 text-gray-400 pointer-events-none">
                  {placeholder}
                </div>
              }
            />
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        <HistoryPlugin />
        <MarkdownShortcutPlugin transformers={TEXT_FORMAT_TRANSFORMERS} />
        <OnChangePlugin onChange={handleChange} />
      </div>
    </LexicalComposer>
  );
}

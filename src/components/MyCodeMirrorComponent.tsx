import { markdown } from "@codemirror/lang-markdown";
import { Vim, vim } from "@replit/codemirror-vim";
import { EditorView } from "@uiw/react-codemirror";
import { useEffect, useRef } from "react";
import styled from "styled-components";

interface MyCodeMirrorComponentProps {
  initialValue: string;
  handleSave: (value: string) => void;
}

function MyCodeMirrorComponent({ initialValue, handleSave }: MyCodeMirrorComponentProps) {
  const editorRef = useRef(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current) {
      const view = new EditorView({
        doc: initialValue,
        extensions: [
          markdown(),
          vim(),
        ],
        parent: editorRef.current,
      });

      viewRef.current = view;

      Vim.defineEx('wq', 'wq', () => {
        const content = view.state.doc.toString();
        handleSave(content);
        view.destroy();
      });

      return () => {
        view.destroy();
      };
    }
  }, [initialValue]);

  return <View ref={editorRef} />;
}

export default MyCodeMirrorComponent;

const View = styled.div`
  font-size: 1.3em;
  width: 120%;
  color: black;
  background-color: white;
  border-radius: 5px;
`

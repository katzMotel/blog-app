"use client";
import React, {useState} from "react";
import styles from "./PostEditor.module.scss";
import style from "styled-jsx/style";
type PostEditorProps = {
    initial?:{title?: string; body?: string; published?: boolean}
    onSave: (data: {title: string; body: string; published: boolean}) => Promise<string | void>
    savingLabel?: string
}
export default function PostEditor({initial = {}, onSave, savingLabel = "Save"}: PostEditorProps){
    const [title, setTitle] = useState(initial.title ??"")
    const [body, setBody] = useState(initial.body ??"")
    const [published, setPublished] = useState(initial.published ?? false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSubmit = async (event: React.FormEvent) =>{
        event.preventDefault();
        setError(null);
        if (!title.trim() || !body.trim()){
            setError("Title and body are required.");
            return;
        }
        setLoading(true);
        try{
            await onSave({title: title.trim(), body: body.trim(), published});
        }catch(err:any){
            setError(err?.message ?? 'Save failed. Please try again.');
        }finally{
            setLoading(false);
        }
    }
    return(
        <form onSubmit = {handleSubmit} className={styles.postEditorForm}>
            <div>
                <label className={styles.title}>Title:</label>
                <input value = {title} onChange = {e => setTitle(e.target.value)} className = {styles.input}/>
            </div>
            <div>
                <label className={styles.body}>Body:</label>
                <textarea value = {body} onChange = {e => setBody(e.target.value)} rows ={10} className = {styles.textarea}/>

            </div>
            <div>
                <label>
                    <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} />
                    Publish
                </label>
            </div>
            {error && <div style={{color: 'red'}}>{error}</div>}
            <button type="submit"  className = {styles.submitButton} disabled={loading}>{loading ? 'Saving...' : savingLabel}</button>
        </form>
    )
     
}
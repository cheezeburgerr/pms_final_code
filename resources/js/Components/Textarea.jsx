import React from 'react';

export default function Textarea({ value, onChange, className }) {
    return (
        <textarea
            value={value}
            onChange={onChange}
            className={`form-textarea mt-1 block w-full ${className} dark:bg-zinc-900`}
        />
    );
}

import React from 'react';

export const FormItem = (props: { label: string } & JSX.ElementChildrenAttribute) => {
  return (
    <div className="form-item">
      <label>{props.label}</label>
      {props.children}
    </div>
  );
};

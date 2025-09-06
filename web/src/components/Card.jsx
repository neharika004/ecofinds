import React from 'react';
import classnames from 'classnames';

export default function Card({ children, className = '', ...props }) {
  return (
    <div className={classnames('card', className)} {...props}>
      {children}
    </div>
  );
}

import React from "react";
import styled from "styled-components";

const SpecialButton = ({ name, onClick }) => {
  return (
    <StyledWrapper>
      <button className="btn" onClick={onClick}>
        <span>{name}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  .btn {
    /* Minimal aesthetic */
    font-weight: 600;
    font-size: 15px;
    line-height: 21px;
    text-shadow: none;
    padding: 0;
    margin: 0;
    appearance: none;
    border: 1px solid #e5e7eb; /* gray-200 */
    outline: none;
    overflow: hidden;
    position: relative;
    cursor: pointer;
    z-index: 1;
    border-radius: 25px;
    color: #0f172a; /* slate-900 */
    background: #ffffff;
    box-shadow: 0 1px 2px rgba(15, 23, 42, 0.04);
    transition: background-color 0.2s ease, border-color 0.2s ease, transform 0.05s ease;
  }

  .btn:before,
  .btn:after { display: none; }

  .btn span {
    display: block;
    padding: 12px 24px;
    border-radius: inherit;
    overflow: hidden;
    position: relative;
    background-image: none;
    z-index: 1;
    color: inherit;
  }

  .btn span:before,
  .btn span:after { display: none; }

  .btn:hover { background-color: #f8fafc; border-color: #e2e8f0; }
  .btn:active { transform: translateY(1px); }
`;

export default SpecialButton;

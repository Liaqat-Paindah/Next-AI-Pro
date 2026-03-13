"use client";

import React from "react";

export default function DocumentsUpload() {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white p-6 rounded-xl shadow-md space-y-6">
      
      <h2 className="text-xl font-semibold text-gray-800 border-b pb-2">
        Required Documents
      </h2>

      {/* Statement of Purpose */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          Statement of Purpose (SOP)
        </label>
        <input
          type="file"
          name="sop"
          accept=".pdf,.doc,.docx"
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Letters of Recommendation */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          Letters of Recommendation
        </label>
        <input
          type="file"
          name="recommendationLetters"
          accept=".pdf,.doc,.docx"
          multiple
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* CV */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          Curriculum Vitae (CV)
        </label>
        <input
          type="file"
          name="cv"
          accept=".pdf,.doc,.docx"
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Research Proposal */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          Research Proposal (For the Intended Degree Program)
        </label>
        <input
          type="file"
          name="researchProposal"
          accept=".pdf,.doc,.docx"
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Portfolio */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          Portfolio (For Art & Design Programs)
        </label>
        <input
          type="file"
          name="portfolio"
          accept=".pdf,.zip"
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* National ID */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          National ID (NID / Tazkira)
        </label>
        <input
          type="file"
          name="nid"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border rounded-lg p-2"
        />
      </div>

      {/* Passport */}
      <div className="space-y-2">
        <label className="font-medium text-gray-700">
          Passport Copy
        </label>
        <input
          type="file"
          name="passport"
          accept=".pdf,.jpg,.jpeg,.png"
          className="w-full border rounded-lg p-2"
        />
      </div>

    </div>
  );
}
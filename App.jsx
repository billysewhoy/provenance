import { useState } from "react";
import {
  AlertTriangle, CheckCircle, ChevronDown, ChevronUp, FileText,
  Globe, Info, Shield, Upload, User, Scale, Search, ArrowLeft,
  Building2, Calendar, Check, Clock, Mail, Tag, Users, X, Cpu,
  AlertCircle, Send, Eye, Download, Star, Lock, BookOpen,
  BarChart2, Layers, PenTool, Briefcase, MapPin, Hash, ChevronRight,
  RefreshCw, Zap
} from "lucide-react";

// ─── Constants ────────────────────────────────────────────────────────────────

const DEMO = {
  name: "Sarah Chen",
  email: "sarah.chen@luminosstudio.co.uk",
  company: "Luminos Studio Ltd",
  role: "Founder & Creative Director",
  enquiryType: "trademark",
  shortQuestion:
    "We want to register our new brand name and logo as a UK and EU trademark. A freelance designer created it but we also used Midjourney for the initial concept work. We're launching in around 6 weeks. Our designer said verbally that we own everything but I'm not sure we got the right paperwork. Is there anything we need to check before we proceed?",
  assetType: "logo",
  assetName: "LUMINOS — wordmark + icon",
  assetDescription:
    "Blue circular icon with a stylised 'L' letterform, and the wordmark LUMINOS set in a custom geometric sans-serif typeface. Both elements intended for use together and separately.",
  aiToolsUsed: true,
  aiTools: "Midjourney v6",
  promptSummary:
    "Minimalist professional logo, blue circle, letter L, clean geometric sans-serif wordmark, white background, brand identity",
  freelancerInvolved: true,
  contractAvailable: false,
  referenceImages: true,
  referenceSource:
    "Pinterest inspiration board — includes images from existing design agencies and established consumer brands",
  licencesAvailable: false,
  intendedUse:
    "Primary brand logo for all commercial uses — trademark registration, product packaging, website, social media, marketing campaigns",
  markets: "United Kingdom, Germany, France, Netherlands",
  launchDate: "2024-08-12",
  alreadyPublished: false,
  complaintReceived: false,
  trademarkSearchDone: false,
  additionalNotes:
    "We have already invested significantly in brand identity development and packaging prototypes. Investor commitments mean we need to move quickly. We have not formally checked whether similar brand names or logos are already registered anywhere.",
};

const ENQUIRY_TYPES = [
  { value: "trademark", label: "Trademark Registration" },
  { value: "copyright", label: "Copyright Query" },
  { value: "infringement", label: "Potential Infringement" },
  { value: "ai-generated", label: "AI-Generated Asset" },
  { value: "licensing", label: "Licence / Permission Query" },
  { value: "brand-review", label: "Brand Asset Review" },
  { value: "dispute", label: "Dispute / Complaint Received" },
  { value: "other", label: "Other IP Matter" },
];

const ASSET_TYPES = [
  { value: "logo", label: "Logo" },
  { value: "brand-name", label: "Brand Name" },
  { value: "mascot", label: "Mascot or Character" },
  { value: "packaging", label: "Packaging Design" },
  { value: "campaign-image", label: "Campaign Image" },
  { value: "social-asset", label: "Social Media Asset" },
  { value: "video", label: "Video or Animation" },
  { value: "music", label: "Music or Sound" },
  { value: "website-copy", label: "Website Copy" },
  { value: "product-design", label: "Product Design" },
  { value: "combined", label: "Combined / Multiple Assets" },
];

const MOCK_FILES = [
  { name: "luminos_logo_final_v3.ai", size: "4.2 MB", type: "Design File", status: "uploaded" },
  { name: "freelancer_brief_email.pdf", size: "180 KB", type: "Correspondence", status: "uploaded" },
  { name: "midjourney_concepts_export.zip", size: "12.8 MB", type: "AI Output", status: "uploaded" },
];

const ROUTES = [
  {
    id: "A",
    label: "More Information Needed",
    color: "amber",
    bgClass: "bg-amber-50 border-amber-200",
    activeClass: "bg-amber-600 border-amber-600 text-white",
    textClass: "text-amber-800",
    iconClass: "text-amber-600",
    description: "Submission is incomplete. Request specific missing materials before the matter can proceed.",
    icon: Info,
  },
  {
    id: "B",
    label: "No Immediate Escalation Trigger",
    color: "emerald",
    bgClass: "bg-emerald-50 border-emerald-200",
    activeClass: "bg-emerald-700 border-emerald-700 text-white",
    textClass: "text-emerald-800",
    iconClass: "text-emerald-600",
    description: "First-screening review complete. No immediate triggers identified at this stage. Standard caveat applies.",
    icon: CheckCircle,
  },
  {
    id: "C",
    label: "Fixed-Fee Preliminary Review",
    color: "blue",
    bgClass: "bg-blue-50 border-blue-200",
    activeClass: "bg-blue-700 border-blue-700 text-white",
    textClass: "text-blue-800",
    iconClass: "text-blue-600",
    description: "Triggers identified. A scoped paid review is recommended before the client proceeds.",
    icon: Search,
  },
  {
    id: "D",
    label: "Full Legal Advice Recommended",
    color: "red",
    bgClass: "bg-red-50 border-red-200",
    activeClass: "bg-red-700 border-red-700 text-white",
    textClass: "text-red-800",
    iconClass: "text-red-600",
    description: "Significant complexity or high-risk triggers identified. Formal consultation required.",
    icon: Scale,
  },
];

// ─── AI Extraction Simulation ─────────────────────────────────────────────────

function extractFromSubmission(data) {
  const triggers = [];
  const missing = [];

  if (data.aiToolsUsed && !data.licencesAvailable) {
    triggers.push({
      severity: "high",
      label: "AI tool output licence unconfirmed",
      detail:
        "Midjourney v6 was used for concept generation. Commercial use rights are dependent on the subscription tier at time of generation (Pro or Mega plans required). No licence documentation or subscription confirmation has been provided.",
      category: "AI / IP Ownership",
    });
  }

  if (data.freelancerInvolved && !data.contractAvailable) {
    triggers.push({
      severity: "high",
      label: "No written freelancer IP assignment confirmed",
      detail:
        "A freelancer was involved in the design process. Without a written work-for-hire agreement or IP assignment clause, copyright in the work may vest in the freelancer, not the client. Only a verbal ownership assurance has been noted.",
      category: "Ownership Chain",
    });
  }

  if (data.additionalNotes?.toLowerCase().includes("verbal") || data.shortQuestion?.toLowerCase().includes("verbal")) {
    triggers.push({
      severity: "high",
      label: "Ownership rests on verbal assurance only",
      detail:
        "Client explicitly notes that ownership was verbally confirmed by the designer. Verbal assurances are not sufficient to transfer copyright. A written assignment is required for registration and enforcement purposes.",
      category: "Ownership Chain",
    });
  }

  if (data.launchDate) {
    const weeksAway = (new Date(data.launchDate) - new Date()) / 604800000;
    if (weeksAway < 10) {
      triggers.push({
        severity: "high",
        label: "Imminent commercial launch",
        detail: `Launch is scheduled approximately ${Math.max(1, Math.round(weeksAway))} weeks from submission. Standard trademark registration timelines (4–6 months at UKIPO, longer at EUIPO) will not align with this launch date without an interim strategy.`,
        category: "Timing / Commercial Risk",
      });
    }
  }

  if (data.referenceImages) {
    triggers.push({
      severity: "medium",
      label: "Third-party reference materials used in creation",
      detail:
        "Client confirms that reference images were used during the design process, sourced from a Pinterest board including existing brand and agency work. The degree of influence on the final design is not known and should be assessed.",
      category: "Third-Party Input",
    });
  }

  if (!data.trademarkSearchDone) {
    triggers.push({
      severity: "medium",
      label: "No prior trademark clearance search conducted",
      detail:
        "Client confirms no trademark clearance search has been carried out at UKIPO, EUIPO, or common law level prior to submission. Conflicting marks may exist that could block registration or give rise to infringement risk.",
      category: "Clearance",
    });
  }

  if (data.markets && data.markets.split(",").length > 1) {
    triggers.push({
      severity: "medium",
      label: "Multi-jurisdiction use intended",
      detail: `Intended markets include: ${data.markets}. Separate trademark applications and clearance searches are required per jurisdiction. Rights in one territory do not provide protection in others.`,
      category: "Jurisdiction",
    });
  }

  if (data.assetType === "logo" && data.enquiryType === "trademark") {
    triggers.push({
      severity: "low",
      label: "Asset intended as registered trademark",
      detail:
        "The asset is intended for registration as a trademark. A complete and unbroken ownership chain, specification advice, and registrability assessment are required before application is filed.",
      category: "Registration",
    });
  }

  // Missing items
  if (!data.contractAvailable)
    missing.push({ item: "Freelancer contract or written IP assignment agreement", priority: "high" });
  if (!data.licencesAvailable)
    missing.push({ item: "Midjourney subscription tier confirmation and commercial licence terms", priority: "high" });
  if (!data.trademarkSearchDone)
    missing.push({ item: "UKIPO and EUIPO trademark clearance search results", priority: "high" });
  missing.push({ item: "Final delivered native design files from freelancer (e.g. .ai, .eps, .fig)", priority: "medium" });
  missing.push({ item: "Invoice or engagement record confirming the work was commissioned", priority: "medium" });
  missing.push({ item: "Confirmation that the designer has no retained rights in any element", priority: "medium" });
  missing.push({ item: "Full list of all reference images and sources used during design", priority: "low" });

  const highCount = triggers.filter((t) => t.severity === "high").length;
  const score = Math.max(22, 100 - missing.length * 7 - highCount * 11);

  let route = "C";
  if (highCount >= 3) route = "D";
  else if (missing.length <= 1 && highCount === 0) route = "B";
  else if (missing.length >= 7 && highCount === 0) route = "A";

  return {
    extractedAssetType: "Logo + wordmark (primary brand identity asset)",
    extractedCreationPath:
      "AI concept generation (Midjourney v6) → freelance designer development and refinement → client approval",
    extractedOwnership: "Uncertain — verbal assurance only, no written assignment or work-for-hire agreement confirmed",
    completenessScore: score,
    triggers,
    missing,
    suggestedRoute: route,
    matterRef: "PIP-2024-0847",
    submittedAt: new Date().toLocaleString("en-GB"),
    firmName: "Hartley & Stone LLP",
  };
}

function generateClientResponse(route, formData, aiResult) {
  const firmName = aiResult.firmName;
  const name = formData.name?.split(" ")[0] || "Client";

  if (route === "A") {
    const missingHigh = aiResult.missing.filter((m) => m.priority === "high");
    return `Dear ${name},

Thank you for submitting your enquiry to ${firmName} regarding your brand asset "${formData.assetName}".

We have carried out an initial review of the information and materials you provided. Before we are able to assess your matter, we require the following information and documents:

${missingHigh.map((m, i) => `${i + 1}. ${m.item}`).join("\n")}

Please resubmit your enquiry with the above materials. Once we have received complete information, we will be able to advise you on the most appropriate next step.

If you have any questions about what is required, please do not hesitate to contact us.

Yours sincerely,
${firmName}

—
This message is sent on behalf of ${firmName}. It does not constitute legal advice and does not create a solicitor-client relationship. No action should be taken in reliance on this message without obtaining formal legal advice.`;
  }

  if (route === "B") {
    return `Dear ${name},

Thank you for submitting your enquiry to ${firmName} regarding your brand asset "${formData.assetName}".

We have completed an initial first-screening review of the materials you submitted. Based on the information provided, no immediate escalation trigger has been identified at first-screening review level.

Please note carefully: this is not legal advice and does not confirm that the asset is legally safe to use, registrable as a trademark, or free from infringement risk. A first-screening review is a preliminary organisational step only. It does not replace a formal legal assessment.

If you would like a lawyer to assess your matter more fully, you may request a paid preliminary review. Please contact us if you wish to discuss next steps.

Yours sincerely,
${firmName}

—
This message is sent on behalf of ${firmName}. It does not constitute legal advice. No action should be taken in reliance on this message without obtaining formal legal advice.`;
  }

  if (route === "C") {
    return `Dear ${name},

Thank you for submitting your enquiry to ${firmName} regarding your brand asset "${formData.assetName}".

We have completed an initial first-screening review of the materials you submitted. Based on the information provided, we have identified a number of matters that require closer review before you proceed, including questions about intellectual property ownership, AI-generated content licensing, and trademark clearance.

We recommend a fixed-fee preliminary review. This would involve a lawyer reviewing your submitted materials, advising on the ownership chain for the asset, confirming your position with respect to AI-generated content, and providing guidance on the steps required before a trademark application is filed.

Please contact us at your earliest convenience so we can confirm the scope and fee for this review. Given your intended launch timeline, we would encourage you to act promptly.

Yours sincerely,
${firmName}

—
This message is sent on behalf of ${firmName}. It does not constitute legal advice. No action should be taken in reliance on this message without obtaining formal legal advice. This communication does not create a solicitor-client relationship.`;
  }

  if (route === "D") {
    return `Dear ${name},

Thank you for submitting your enquiry to ${firmName} regarding your brand asset "${formData.assetName}".

We have completed an initial first-screening review of the materials you submitted. Based on the nature and complexity of the matters identified — including questions of IP ownership, AI-generated content, freelancer assignments, multi-jurisdiction trademark clearance, and your intended commercial launch timeline — we recommend that you obtain formal legal advice before taking any further steps.

We would like to arrange a consultation with one of our intellectual property specialists to discuss your position in full. A member of our team will contact you within two business days to confirm availability and the scope of the consultation.

In the meantime, we would strongly advise you not to publish the asset, file any trademark applications, or commit further commercial expenditure in relation to this brand identity pending legal advice.

Yours sincerely,
${firmName}

—
This message is sent on behalf of ${firmName}. It does not constitute legal advice. This communication does not create a solicitor-client relationship. No action should be taken in reliance on this communication without obtaining formal legal advice.`;
  }
}

// ─── Shared UI Components ─────────────────────────────────────────────────────

const Badge = ({ children, color = "slate", size = "sm" }) => {
  const colors = {
    slate: "bg-slate-100 text-slate-600",
    amber: "bg-amber-50 text-amber-700 border border-amber-200",
    red: "bg-red-50 text-red-700 border border-red-200",
    "red-solid": "bg-red-600 text-white",
    emerald: "bg-emerald-50 text-emerald-700 border border-emerald-200",
    blue: "bg-blue-50 text-blue-700 border border-blue-200",
    indigo: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    orange: "bg-orange-50 text-orange-700 border border-orange-200",
    purple: "bg-purple-50 text-purple-700 border border-purple-200",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colors[color]}`}>
      {children}
    </span>
  );
};

const SeverityDot = ({ severity }) => {
  const cfg = {
    high: "bg-red-500",
    medium: "bg-amber-500",
    low: "bg-blue-400",
  };
  return <span className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${cfg[severity]}`} />;
};

const InfoRow = ({ label, value, highlight }) => (
  <div className="flex gap-3 py-2.5 border-b border-slate-100 last:border-0">
    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide w-44 flex-shrink-0 pt-0.5">
      {label}
    </span>
    <span className={`text-sm flex-1 ${highlight ? "font-medium text-slate-800" : "text-slate-700"}`}>
      {value || <span className="text-slate-400 italic">Not provided</span>}
    </span>
  </div>
);

function SectionCard({ title, icon: Icon, iconBg, children, id, expanded, onToggle, badge }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden mb-4 shadow-sm" id={id}>
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50 transition-colors group"
      >
        <div className="flex items-center gap-3">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${iconBg || "bg-indigo-50"}`}>
            <Icon size={15} className="text-indigo-700" />
          </div>
          <span className="font-semibold text-slate-800 text-sm">{title}</span>
          {badge && <span className="ml-1">{badge}</span>}
        </div>
        {expanded ? (
          <ChevronUp size={15} className="text-slate-400" />
        ) : (
          <ChevronDown size={15} className="text-slate-400" />
        )}
      </button>
      {expanded && (
        <div className="px-6 pb-6 border-t border-slate-100 pt-4">{children}</div>
      )}
    </div>
  );
}

function FormLabel({ children, required, hint }) {
  return (
    <div className="mb-1.5">
      <label className="block text-sm font-medium text-slate-700">
        {children}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {hint && <p className="text-xs text-slate-400 mt-0.5">{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, ...props }) {
  return (
    <input
      type="text"
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
      {...props}
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 4 }) {
  return (
    <textarea
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors resize-none"
    />
  );
}

function Select({ value, onChange, options, placeholder }) {
  return (
    <select
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-3 py-2.5 text-sm border border-slate-200 rounded-lg bg-white text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors appearance-none"
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}

function YesNo({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {[true, false].map((opt) => (
        <button
          key={String(opt)}
          type="button"
          onClick={() => onChange(opt)}
          className={`px-5 py-2 text-sm rounded-lg border font-medium transition-all ${
            value === opt
              ? "bg-indigo-700 text-white border-indigo-700 shadow-sm"
              : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
          }`}
        >
          {opt ? "Yes" : "No"}
        </button>
      ))}
    </div>
  );
}

// ─── Processing View ──────────────────────────────────────────────────────────

function ProcessingView({ progress }) {
  const steps = [
    "Analysing submitted materials and description",
    "Extracting asset type and creation path",
    "Identifying IP ownership indicators",
    "Assessing completeness and information gaps",
    "Flagging first-screening review triggers",
    "Preparing lawyer-ready intake packet",
  ];
  const activeStep = Math.min(Math.floor((progress / 100) * steps.length), steps.length - 1);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-14 h-14 bg-indigo-700 rounded-2xl flex items-center justify-center mx-auto mb-5">
            <Scale size={24} className="text-white" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-1.5">Preparing Intake Packet</h2>
          <p className="text-sm text-slate-500">
            Organising submitted materials for lawyer review. Please wait.
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-5 shadow-sm">
          <div className="space-y-3.5">
            {steps.map((step, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                {i < activeStep ? (
                  <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                ) : i === activeStep ? (
                  <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
                ) : (
                  <div className="w-4 h-4 rounded-full border-2 border-slate-200 flex-shrink-0 mt-0.5" />
                )}
                <span
                  className={
                    i < activeStep
                      ? "text-slate-500 line-through"
                      : i === activeStep
                      ? "text-slate-800 font-medium"
                      : "text-slate-400"
                  }
                >
                  {step}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-200 rounded-full h-1.5 overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-slate-400 mt-1.5">
          <span>Processing</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>
    </div>
  );
}

// ─── Client Intake Steps ──────────────────────────────────────────────────────

function StepIndicator({ current, total, labels }) {
  return (
    <div className="flex items-center gap-0">
      {Array.from({ length: total }).map((_, i) => {
        const num = i + 1;
        const done = num < current;
        const active = num === current;
        return (
          <div key={i} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-all ${
                  done
                    ? "bg-indigo-700 border-indigo-700 text-white"
                    : active
                    ? "bg-white border-indigo-700 text-indigo-700"
                    : "bg-white border-slate-200 text-slate-400"
                }`}
              >
                {done ? <Check size={13} /> : num}
              </div>
              {labels && (
                <span
                  className={`text-xs mt-1 whitespace-nowrap hidden sm:block ${
                    active ? "text-indigo-700 font-medium" : done ? "text-slate-500" : "text-slate-400"
                  }`}
                >
                  {labels[i]}
                </span>
              )}
            </div>
            {i < total - 1 && (
              <div
                className={`h-0.5 w-12 sm:w-20 mx-1 mb-5 transition-all ${
                  done ? "bg-indigo-700" : "bg-slate-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

function ClientIntake({ formData, updateField, currentStep, setCurrentStep, totalSteps, onSubmit }) {
  const stepLabels = ["Enquiry", "Asset", "Creation", "Use", "Materials"];

  const renderStep = () => {
    if (currentStep === 1) return <Step1 formData={formData} updateField={updateField} />;
    if (currentStep === 2) return <Step2 formData={formData} updateField={updateField} />;
    if (currentStep === 3) return <Step3 formData={formData} updateField={updateField} />;
    if (currentStep === 4) return <Step4 formData={formData} updateField={updateField} />;
    if (currentStep === 5) return <Step5 formData={formData} updateField={updateField} onSubmit={onSubmit} />;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-indigo-700 rounded-lg flex items-center justify-center">
              <Scale size={16} className="text-white" />
            </div>
            <div>
              <div className="font-semibold text-slate-800 text-sm leading-tight">ProvenanceIP</div>
              <div className="text-xs text-slate-400 leading-tight">Hartley & Stone LLP</div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Lock size={13} className="text-slate-400" />
            <span className="text-xs text-slate-400">Secure intake portal</span>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-indigo-700 text-indigo-100 text-xs text-center py-2 px-4">
        <Zap size={11} className="inline mr-1.5 mb-0.5" />
        Prototype demonstration — form is pre-filled with a sample scenario. Click through each step to proceed.
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">
        {/* Intro */}
        {currentStep === 1 && (
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-slate-900 mb-2">IP Enquiry Intake</h1>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xl">
              This secure form helps us collect the information needed to assess your enquiry. Completing it
              in full allows us to respond more quickly and accurately. This form does not provide legal advice.
            </p>
          </div>
        )}

        {/* Step indicator */}
        <div className="mb-8 flex justify-center">
          <StepIndicator current={currentStep} total={totalSteps} labels={stepLabels} />
        </div>

        {/* Step content */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          {renderStep()}
        </div>

        {/* Navigation */}
        {currentStep < 5 && (
          <div className="flex justify-between mt-6">
            <button
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                currentStep === 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <ArrowLeft size={15} />
              Back
            </button>
            <button
              onClick={() => setCurrentStep((s) => Math.min(totalSteps, s + 1))}
              className="flex items-center gap-2 px-6 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-lg text-sm font-medium transition-all shadow-sm"
            >
              Continue
              <ChevronRight size={15} />
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="max-w-3xl mx-auto px-6 pb-10 text-center">
        <p className="text-xs text-slate-400 leading-relaxed">
          This intake portal is operated by Hartley & Stone LLP. Information submitted is handled in
          accordance with our privacy policy. Submitting this form does not create a solicitor-client
          relationship and does not constitute legal advice.
        </p>
      </div>
    </div>
  );
}

function StepHeader({ step, title, description }) {
  return (
    <div className="px-8 pt-8 pb-6 border-b border-slate-100">
      <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wider mb-1">Step {step} of 5</div>
      <h2 className="text-lg font-bold text-slate-900 mb-1">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </div>
  );
}

function Step1({ formData, updateField }) {
  return (
    <div>
      <StepHeader step={1} title="Your Enquiry" description="Tell us about yourself and describe your IP question in your own words." />
      <div className="px-8 py-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel required>Full Name</FormLabel>
            <TextInput value={formData.name} onChange={(v) => updateField("name", v)} placeholder="Your name" />
          </div>
          <div>
            <FormLabel required>Email Address</FormLabel>
            <TextInput value={formData.email} onChange={(v) => updateField("email", v)} placeholder="you@company.com" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel>Company / Organisation</FormLabel>
            <TextInput value={formData.company} onChange={(v) => updateField("company", v)} placeholder="Company name" />
          </div>
          <div>
            <FormLabel>Your Role</FormLabel>
            <TextInput value={formData.role} onChange={(v) => updateField("role", v)} placeholder="e.g. Founder, Head of Marketing" />
          </div>
        </div>
        <div>
          <FormLabel required>Type of Enquiry</FormLabel>
          <Select value={formData.enquiryType} onChange={(v) => updateField("enquiryType", v)} options={ENQUIRY_TYPES} placeholder="Select enquiry type…" />
        </div>
        <div>
          <FormLabel required hint="Describe your question in plain language. Include any relevant context — the more detail you provide, the better we can help.">
            Your Question
          </FormLabel>
          <TextArea
            value={formData.shortQuestion}
            onChange={(v) => updateField("shortQuestion", v)}
            placeholder="Describe your IP question or concern…"
            rows={5}
          />
        </div>
      </div>
    </div>
  );
}

function Step2({ formData, updateField }) {
  return (
    <div>
      <StepHeader step={2} title="The Asset" description="Describe the specific creative asset or brand element your enquiry relates to." />
      <div className="px-8 py-6 space-y-5">
        <div>
          <FormLabel required>Asset Type</FormLabel>
          <Select value={formData.assetType} onChange={(v) => updateField("assetType", v)} options={ASSET_TYPES} placeholder="Select asset type…" />
        </div>
        <div>
          <FormLabel required hint="The working name or identifier you use for this asset.">
            Asset Name
          </FormLabel>
          <TextInput value={formData.assetName} onChange={(v) => updateField("assetName", v)} placeholder="e.g. LUMINOS logo, Project Atlas packaging" />
        </div>
        <div>
          <FormLabel hint="Describe what the asset looks like, what it contains, or what it does. Include colours, text, style, elements.">
            Asset Description
          </FormLabel>
          <TextArea
            value={formData.assetDescription}
            onChange={(v) => updateField("assetDescription", v)}
            placeholder="Describe the asset in as much detail as you can…"
            rows={4}
          />
        </div>
        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
          <p className="text-xs text-slate-500 flex items-start gap-2">
            <Info size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
            You will be able to upload design files and supporting documents in Step 5.
          </p>
        </div>
      </div>
    </div>
  );
}

function Step3({ formData, updateField }) {
  return (
    <div>
      <StepHeader step={3} title="Creation & Ownership" description="Tell us how the asset was created and who owns it." />
      <div className="px-8 py-6 space-y-6">
        <div>
          <FormLabel>Were AI tools used to create or develop this asset?</FormLabel>
          <YesNo value={formData.aiToolsUsed} onChange={(v) => updateField("aiToolsUsed", v)} />
          {formData.aiToolsUsed && (
            <div className="mt-4 space-y-4 pl-4 border-l-2 border-indigo-200">
              <div>
                <FormLabel hint="e.g. Midjourney, DALL-E, Adobe Firefly, Stable Diffusion">
                  Which AI tools were used?
                </FormLabel>
                <TextInput value={formData.aiTools} onChange={(v) => updateField("aiTools", v)} placeholder="List the AI tools used" />
              </div>
              <div>
                <FormLabel hint="A summary is fine. This helps us understand the nature of the AI involvement.">
                  Prompt or prompt summary (if applicable)
                </FormLabel>
                <TextArea value={formData.promptSummary} onChange={(v) => updateField("promptSummary", v)} placeholder="Describe the prompts used…" rows={3} />
              </div>
            </div>
          )}
        </div>

        <div>
          <FormLabel>Were freelancers, employees, or agencies involved in creating the asset?</FormLabel>
          <YesNo value={formData.freelancerInvolved} onChange={(v) => updateField("freelancerInvolved", v)} />
          {formData.freelancerInvolved && (
            <div className="mt-4 pl-4 border-l-2 border-indigo-200">
              <FormLabel>Do you have a written contract, work-for-hire agreement, or IP assignment?</FormLabel>
              <YesNo value={formData.contractAvailable} onChange={(v) => updateField("contractAvailable", v)} />
              {!formData.contractAvailable && formData.contractAvailable !== null && (
                <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex gap-2 text-xs text-amber-800">
                  <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
                  Without a written IP assignment, copyright may vest in the creator. Please upload any relevant correspondence or agreements in Step 5.
                </div>
              )}
            </div>
          )}
        </div>

        <div>
          <FormLabel>Were any reference images or third-party materials used during the creation process?</FormLabel>
          <YesNo value={formData.referenceImages} onChange={(v) => updateField("referenceImages", v)} />
          {formData.referenceImages && (
            <div className="mt-4 pl-4 border-l-2 border-indigo-200">
              <FormLabel hint="e.g. Pinterest boards, competitor logos, stock image libraries, existing brand work">
                Source of reference materials
              </FormLabel>
              <TextArea value={formData.referenceSource} onChange={(v) => updateField("referenceSource", v)} placeholder="Describe sources used…" rows={2} />
            </div>
          )}
        </div>

        <div>
          <FormLabel>Are any licences for third-party elements or tools available?</FormLabel>
          <YesNo value={formData.licencesAvailable} onChange={(v) => updateField("licencesAvailable", v)} />
        </div>
      </div>
    </div>
  );
}

function Step4({ formData, updateField }) {
  return (
    <div>
      <StepHeader step={4} title="Intended Use & Context" description="Tell us how and where the asset will be used commercially." />
      <div className="px-8 py-6 space-y-5">
        <div>
          <FormLabel hint="e.g. primary brand logo, product packaging, social media campaign, one-off print use">
            Intended Use
          </FormLabel>
          <TextArea value={formData.intendedUse} onChange={(v) => updateField("intendedUse", v)} placeholder="Describe how the asset will be used…" rows={3} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <FormLabel hint="List all countries or regions where the asset will be used.">
              Intended Markets
            </FormLabel>
            <TextInput value={formData.markets} onChange={(v) => updateField("markets", v)} placeholder="e.g. UK, USA, EU" />
          </div>
          <div>
            <FormLabel>Intended Launch Date</FormLabel>
            <TextInput type="date" value={formData.launchDate} onChange={(v) => updateField("launchDate", v)} />
          </div>
        </div>
        <div>
          <FormLabel>Has the asset already been published or publicly used?</FormLabel>
          <YesNo value={formData.alreadyPublished} onChange={(v) => updateField("alreadyPublished", v)} />
        </div>
        <div>
          <FormLabel>Have you received any complaint, warning letter, or threat of action relating to this asset?</FormLabel>
          <YesNo value={formData.complaintReceived} onChange={(v) => updateField("complaintReceived", v)} />
          {formData.complaintReceived && (
            <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3 flex gap-2 text-xs text-red-800">
              <AlertTriangle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              If you have received a legal notice or formal complaint, please upload a copy in Step 5 and seek legal advice promptly.
            </div>
          )}
        </div>
        <div>
          <FormLabel>Has a trademark or clearance search been carried out for this asset or brand name?</FormLabel>
          <YesNo value={formData.trademarkSearchDone} onChange={(v) => updateField("trademarkSearchDone", v)} />
        </div>
      </div>
    </div>
  );
}

function Step5({ formData, updateField, onSubmit }) {
  return (
    <div>
      <StepHeader step={5} title="Materials & Review" description="Upload supporting files and add any additional notes before submitting." />
      <div className="px-8 py-6 space-y-6">
        <div>
          <FormLabel hint="Include design files, contracts, licences, trademark search results, AI outputs, correspondence, or any other relevant materials.">
            Additional Notes
          </FormLabel>
          <TextArea value={formData.additionalNotes} onChange={(v) => updateField("additionalNotes", v)} placeholder="Any other context that may be relevant…" rows={4} />
        </div>

        {/* Mock file upload */}
        <div>
          <FormLabel>Supporting Files</FormLabel>
          <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors cursor-pointer group bg-slate-50">
            <Upload size={22} className="text-slate-300 mx-auto mb-2 group-hover:text-indigo-400 transition-colors" />
            <p className="text-sm font-medium text-slate-500 group-hover:text-slate-600">Drag files here or click to browse</p>
            <p className="text-xs text-slate-400 mt-1">PDF, AI, EPS, PNG, JPEG, ZIP, DOCX — up to 50 MB per file</p>
          </div>
          {/* Mock uploaded files */}
          <div className="mt-3 space-y-2">
            {MOCK_FILES.map((f, i) => (
              <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                <div className="w-8 h-8 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-indigo-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-700 truncate">{f.name}</div>
                  <div className="text-xs text-slate-400">{f.size} · {f.type}</div>
                </div>
                <Badge color="emerald">Uploaded</Badge>
              </div>
            ))}
          </div>
        </div>

        {/* Declaration */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Before you submit</h4>
          <ul className="space-y-1.5 text-xs text-slate-500">
            {[
              "The information I have provided is accurate to the best of my knowledge.",
              "I understand this form does not provide legal advice.",
              "I understand that submitting this form does not create a solicitor-client relationship.",
              "I consent to Hartley & Stone LLP storing this information to respond to my enquiry.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <Check size={12} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={onSubmit}
          className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
        >
          <Send size={16} />
          Submit Intake for Review
        </button>
      </div>
    </div>
  );
}

// ─── Lawyer Dashboard ─────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const color = score >= 70 ? "text-emerald-600" : score >= 45 ? "text-amber-500" : "text-red-500";
  const ring = score >= 70 ? "stroke-emerald-500" : score >= 45 ? "stroke-amber-500" : "stroke-red-500";
  const r = 26;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (score / 100) * circ;
  return (
    <div className="relative w-20 h-20 flex items-center justify-center">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r={r} strokeWidth="5" fill="none" className="stroke-slate-100" />
        <circle
          cx="40" cy="40" r={r} strokeWidth="5" fill="none"
          className={ring}
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={dashOffset}
          transform="rotate(-90 40 40)"
          style={{ transition: "stroke-dashoffset 1s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={`text-lg font-bold leading-none ${color}`}>{score}%</span>
        <span className="text-xs text-slate-400">complete</span>
      </div>
    </div>
  );
}

function LawyerDashboard({ formData, aiResult, selectedRoute, setSelectedRoute, responseGenerated, setResponseGenerated, expandedSections, toggleSection, onBackToClient }) {
  const [responseText, setResponseText] = useState("");
  const [activeTab, setActiveTab] = useState("packet");

  const handleGenerateResponse = (routeId) => {
    const text = generateClientResponse(routeId, formData, aiResult);
    setResponseText(text);
    setResponseGenerated(true);
  };

  const highTriggers = aiResult.triggers.filter((t) => t.severity === "high");
  const medTriggers = aiResult.triggers.filter((t) => t.severity === "medium");
  const lowTriggers = aiResult.triggers.filter((t) => t.severity === "low");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-indigo-700 rounded-md flex items-center justify-center">
                <Scale size={14} className="text-white" />
              </div>
              <span className="font-bold text-slate-800 text-sm">ProvenanceIP</span>
              <span className="text-slate-300">|</span>
              <span className="text-sm text-slate-500">Lawyer Review Portal</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge color="indigo">
              <Hash size={11} className="mr-1" />
              {aiResult.matterRef}
            </Badge>
            <Badge color="slate">{aiResult.submittedAt}</Badge>
            <button
              onClick={onBackToClient}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <ArrowLeft size={13} />
              Client view
            </button>
          </div>
        </div>
      </header>

      {/* Demo Banner */}
      <div className="bg-indigo-700 text-indigo-100 text-xs text-center py-2 px-4">
        <Zap size={11} className="inline mr-1.5 mb-0.5" />
        Prototype demonstration — this is a simulated lawyer review packet based on the client demo submission.
      </div>

      <div className="max-w-6xl mx-auto px-6 py-6 flex gap-6 flex-1 w-full">
        {/* Left: Packet */}
        <div className="flex-1 min-w-0">
          {/* Header card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-4 shadow-sm">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">New submission</span>
                  <span className="text-slate-200">·</span>
                  <span className="text-xs text-slate-400">{aiResult.submittedAt}</span>
                </div>
                <h1 className="text-xl font-bold text-slate-900 mb-1">
                  {formData.assetName}
                </h1>
                <p className="text-sm text-slate-500 mb-3">
                  {ENQUIRY_TYPES.find((e) => e.value === formData.enquiryType)?.label} ·{" "}
                  {ASSET_TYPES.find((a) => a.value === formData.assetType)?.label} · {formData.company}
                </p>
                <div className="flex flex-wrap gap-2">
                  {highTriggers.length > 0 && (
                    <Badge color="red">{highTriggers.length} high-priority trigger{highTriggers.length > 1 ? "s" : ""}</Badge>
                  )}
                  {medTriggers.length > 0 && (
                    <Badge color="amber">{medTriggers.length} medium trigger{medTriggers.length > 1 ? "s" : ""}</Badge>
                  )}
                  <Badge color={aiResult.suggestedRoute === "D" ? "red" : aiResult.suggestedRoute === "C" ? "blue" : "emerald"}>
                    Route {aiResult.suggestedRoute} suggested
                  </Badge>
                  <Badge color="slate">{aiResult.missing.length} items missing</Badge>
                </div>
              </div>
              <ScoreRing score={aiResult.completenessScore} />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-4 bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
            {[
              { id: "packet", label: "Intake Packet", icon: FileText },
              { id: "triggers", label: "Triggers & Gaps", icon: AlertTriangle },
              { id: "evidence", label: "Evidence Bundle", icon: Download },
            ].map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === id
                    ? "bg-indigo-700 text-white shadow-sm"
                    : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </div>

          {/* Packet tab */}
          {activeTab === "packet" && (
            <div>
              <SectionCard title="Matter Summary" icon={Briefcase} id="matter" expanded={expandedSections.matter} onToggle={() => toggleSection("matter")}>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Matter Reference" value={aiResult.matterRef} highlight />
                  <InfoRow label="Client" value={`${formData.name} — ${formData.role}, ${formData.company}`} />
                  <InfoRow label="Email" value={formData.email} />
                  <InfoRow label="Enquiry Type" value={ENQUIRY_TYPES.find((e) => e.value === formData.enquiryType)?.label} />
                  <InfoRow label="Submitted" value={aiResult.submittedAt} />
                </div>
              </SectionCard>

              <SectionCard title="Client Question" icon={BookOpen} id="question" expanded={expandedSections.question} onToggle={() => toggleSection("question")}>
                <div className="bg-slate-50 rounded-lg p-4 border border-slate-200 text-sm text-slate-700 leading-relaxed italic">
                  "{formData.shortQuestion}"
                </div>
              </SectionCard>

              <SectionCard title="Asset Overview" icon={Tag} id="asset" expanded={expandedSections.asset} onToggle={() => toggleSection("asset")}>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Asset Name" value={formData.assetName} highlight />
                  <InfoRow label="Asset Type" value={aiResult.extractedAssetType} />
                  <InfoRow label="Description" value={formData.assetDescription} />
                  <InfoRow label="Intended Use" value={formData.intendedUse} />
                </div>
              </SectionCard>

              <SectionCard title="Creation Path" icon={PenTool} id="creation" expanded={expandedSections.creation} onToggle={() => toggleSection("creation")}>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Creation Path" value={aiResult.extractedCreationPath} highlight />
                  <InfoRow label="AI Tools Used" value={formData.aiToolsUsed ? formData.aiTools : "No"} />
                  {formData.aiToolsUsed && <InfoRow label="Prompt Summary" value={formData.promptSummary} />}
                  <InfoRow label="Freelancer / Agency" value={formData.freelancerInvolved ? "Yes" : "No"} />
                  <InfoRow label="Reference Images" value={formData.referenceImages ? `Yes — ${formData.referenceSource}` : "No"} />
                </div>
              </SectionCard>

              <SectionCard title="Rights & Permissions" icon={Shield} id="rights" expanded={expandedSections.rights} onToggle={() => toggleSection("rights")}>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Ownership Status" value={aiResult.extractedOwnership} highlight />
                  <InfoRow
                    label="Written Assignment"
                    value={
                      formData.contractAvailable ? "Contract / assignment available" : "Not available — verbal assurance only"
                    }
                  />
                  <InfoRow
                    label="Licences"
                    value={formData.licencesAvailable ? "Licences available" : "No licences provided"}
                  />
                  <InfoRow label="Trademark Search" value={formData.trademarkSearchDone ? "Completed" : "Not conducted"} />
                </div>
              </SectionCard>

              <SectionCard title="Commercial Context" icon={Globe} id="use" expanded={expandedSections.use} onToggle={() => toggleSection("use")}>
                <div className="divide-y divide-slate-100">
                  <InfoRow label="Markets" value={formData.markets} />
                  <InfoRow label="Launch Date" value={formData.launchDate} />
                  <InfoRow label="Already Published" value={formData.alreadyPublished ? "Yes" : "No"} />
                  <InfoRow label="Complaint Received" value={formData.complaintReceived ? "Yes — see notes" : "No"} />
                </div>
              </SectionCard>

              {formData.additionalNotes && (
                <SectionCard title="Additional Client Notes" icon={FileText} id="notes" expanded={expandedSections.notes} onToggle={() => toggleSection("notes")}>
                  <p className="text-sm text-slate-700 leading-relaxed">{formData.additionalNotes}</p>
                </SectionCard>
              )}
            </div>
          )}

          {/* Triggers tab */}
          {activeTab === "triggers" && (
            <div>
              {/* Summary */}
              <div className="grid grid-cols-3 gap-3 mb-4">
                {[
                  { label: "High Priority", count: highTriggers.length, color: "text-red-600", bg: "bg-red-50 border-red-200" },
                  { label: "Medium Priority", count: medTriggers.length, color: "text-amber-600", bg: "bg-amber-50 border-amber-200" },
                  { label: "Low / Informational", count: lowTriggers.length, color: "text-blue-600", bg: "bg-blue-50 border-blue-200" },
                ].map(({ label, count, color, bg }) => (
                  <div key={label} className={`${bg} border rounded-xl p-4 text-center`}>
                    <div className={`text-2xl font-bold ${color}`}>{count}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>

              <SectionCard title="First-Screening Review Triggers" icon={AlertTriangle} iconBg="bg-amber-50" expanded={true} onToggle={() => {}}>
                <div className="space-y-4">
                  {aiResult.triggers.map((t, i) => {
                    const sev = {
                      high: { bg: "bg-red-50 border-red-200", badge: "red", label: "HIGH" },
                      medium: { bg: "bg-amber-50 border-amber-200", badge: "amber", label: "MEDIUM" },
                      low: { bg: "bg-blue-50 border-blue-200", badge: "blue", label: "LOW" },
                    }[t.severity];
                    return (
                      <div key={i} className={`${sev.bg} border rounded-xl p-4`}>
                        <div className="flex items-start justify-between gap-3 mb-2">
                          <div className="font-semibold text-sm text-slate-800">{t.label}</div>
                          <div className="flex gap-1.5 flex-shrink-0">
                            <Badge color={sev.badge}>{sev.label}</Badge>
                            <Badge color="slate">{t.category}</Badge>
                          </div>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed">{t.detail}</p>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>

              <SectionCard title="Missing Information" icon={AlertCircle} iconBg="bg-amber-50" expanded={true} onToggle={() => {}}>
                <div className="space-y-2">
                  {aiResult.missing.map((m, i) => {
                    const pColor = { high: "red", medium: "amber", low: "slate" }[m.priority];
                    return (
                      <div key={i} className="flex items-start gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg">
                        <X size={14} className="text-slate-400 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-700 flex-1">{m.item}</span>
                        <Badge color={pColor}>{m.priority.toUpperCase()}</Badge>
                      </div>
                    );
                  })}
                </div>
              </SectionCard>
            </div>
          )}

          {/* Evidence tab */}
          {activeTab === "evidence" && (
            <div>
              <SectionCard title="Uploaded Files" icon={Download} expanded={true} onToggle={() => {}}>
                <div className="space-y-2">
                  {MOCK_FILES.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white border border-slate-200 rounded-lg hover:border-slate-300 transition-colors">
                      <div className="w-9 h-9 bg-indigo-50 rounded-lg flex items-center justify-center flex-shrink-0">
                        <FileText size={16} className="text-indigo-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-slate-700">{f.name}</div>
                        <div className="text-xs text-slate-400">{f.size} · {f.type}</div>
                      </div>
                      <Badge color="emerald">Uploaded</Badge>
                      <button className="text-xs text-indigo-600 hover:text-indigo-800 font-medium px-2">View</button>
                    </div>
                  ))}
                </div>
              </SectionCard>
              <SectionCard title="Extracted Evidence Notes" icon={Eye} expanded={true} onToggle={() => {}}>
                <div className="space-y-3 text-sm text-slate-600">
                  {[
                    ["luminos_logo_final_v3.ai", "Final delivered design file. Ownership chain for this file not confirmed by written contract."],
                    ["freelancer_brief_email.pdf", "Email correspondence regarding design brief. No formal IP assignment or work-for-hire terms included."],
                    ["midjourney_concepts_export.zip", "AI-generated concept outputs from Midjourney v6. Subscription tier and commercial licence terms not confirmed."],
                  ].map(([file, note], i) => (
                    <div key={i} className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                      <div className="font-medium text-slate-700 text-xs mb-1">{file}</div>
                      <div className="text-xs text-slate-500">{note}</div>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}
        </div>

        {/* Right: Routing + Response */}
        <div className="w-80 flex-shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* Routing card */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-slate-800 text-sm">Select Response Route</h3>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Suggested: <span className="font-semibold text-indigo-700">Route {aiResult.suggestedRoute}</span>
              </p>
              <div className="space-y-2.5">
                {ROUTES.map((route) => {
                  const Icon = route.icon;
                  const isSelected = selectedRoute === route.id;
                  const isSuggested = aiResult.suggestedRoute === route.id;
                  return (
                    <button
                      key={route.id}
                      onClick={() => {
                        setSelectedRoute(route.id);
                        setResponseGenerated(false);
                      }}
                      className={`w-full text-left p-3.5 rounded-xl border-2 transition-all ${
                        isSelected
                          ? "border-indigo-600 bg-indigo-50"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "bg-indigo-700" : "bg-slate-100"}`}>
                          <Icon size={12} className={isSelected ? "text-white" : "text-slate-400"} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-0.5">
                            <span className={`text-xs font-bold ${isSelected ? "text-indigo-700" : "text-slate-500"}`}>
                              Route {route.id}
                            </span>
                            {isSuggested && !isSelected && (
                              <Badge color="indigo">Suggested</Badge>
                            )}
                          </div>
                          <div className={`text-xs font-semibold leading-tight ${isSelected ? "text-indigo-800" : "text-slate-700"}`}>
                            {route.label}
                          </div>
                          <p className="text-xs text-slate-400 mt-1 leading-relaxed">{route.description}</p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>

              {selectedRoute && !responseGenerated && (
                <button
                  onClick={() => handleGenerateResponse(selectedRoute)}
                  className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl text-sm font-semibold transition-all shadow-sm"
                >
                  <Send size={14} />
                  Generate Client Response
                </button>
              )}
            </div>

            {/* Generated response */}
            {responseGenerated && responseText && (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-slate-800 text-sm">Client Response</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        handleGenerateResponse(selectedRoute);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700 flex items-center gap-1"
                    >
                      <RefreshCw size={11} />
                      Regenerate
                    </button>
                  </div>
                </div>
                <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 mb-3 max-h-64 overflow-y-auto">
                  <pre className="text-xs text-slate-700 whitespace-pre-wrap font-sans leading-relaxed">{responseText}</pre>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-800 mb-3 flex gap-2">
                  <AlertTriangle size={12} className="flex-shrink-0 mt-0.5 text-amber-500" />
                  Review before sending. This draft is generated for lawyer review only and must be checked before dispatch.
                </div>
                <div className="flex gap-2">
                  <button className="flex-1 py-2.5 bg-indigo-700 hover:bg-indigo-800 text-white text-xs font-semibold rounded-lg transition-all flex items-center justify-center gap-1.5">
                    <Send size={12} />
                    Approve & Send
                  </button>
                  <button className="flex-1 py-2.5 border border-slate-200 text-slate-600 text-xs font-medium rounded-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5">
                    <PenTool size={12} />
                    Edit Draft
                  </button>
                </div>
              </div>
            )}

            {/* Completeness snapshot */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
              <h3 className="font-semibold text-slate-800 text-sm mb-3">Submission Completeness</h3>
              <div className="flex items-center gap-4 mb-3">
                <ScoreRing score={aiResult.completenessScore} />
                <div className="flex-1">
                  <div className="text-xs text-slate-500 mb-2">Key gaps</div>
                  {aiResult.missing.filter((m) => m.priority === "high").map((m, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-red-700 mb-1">
                      <X size={11} className="flex-shrink-0 mt-0.5" />
                      <span className="leading-tight">{m.item.split(" ").slice(0, 5).join(" ")}…</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="text-xs text-slate-400 bg-slate-50 rounded-lg p-2.5 leading-relaxed">
                First-screening review complete. {highTriggers.length} high-priority trigger{highTriggers.length !== 1 ? "s" : ""} identified.{" "}
                {aiResult.missing.length} items missing from submission.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function ProvenanceIP() {
  const [view, setView] = useState("client");
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(DEMO);
  const [aiResult, setAiResult] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [responseGenerated, setResponseGenerated] = useState(false);
  const [processingProgress, setProcessingProgress] = useState(0);
  const [expandedSections, setExpandedSections] = useState({
    matter: true, question: true, asset: true, creation: true,
    rights: true, use: true, notes: true, missing: true, triggers: true,
    routing: true, evidence: true,
  });

  const toggleSection = (section) =>
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));

  const updateField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = () => {
    setView("processing");
    setProcessingProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 12 + 4;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        const result = extractFromSubmission(formData);
        setAiResult(result);
        setTimeout(() => setView("lawyer"), 500);
      }
      setProcessingProgress(Math.min(progress, 100));
    }, 180);
  };

  if (view === "processing") return <ProcessingView progress={processingProgress} />;

  if (view === "lawyer" && aiResult)
    return (
      <LawyerDashboard
        formData={formData}
        aiResult={aiResult}
        selectedRoute={selectedRoute}
        setSelectedRoute={setSelectedRoute}
        responseGenerated={responseGenerated}
        setResponseGenerated={setResponseGenerated}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
        onBackToClient={() => {
          setView("client");
          setCurrentStep(1);
          setAiResult(null);
          setSelectedRoute(null);
          setResponseGenerated(false);
          setProcessingProgress(0);
        }}
      />
    );

  return (
    <ClientIntake
      formData={formData}
      updateField={updateField}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      totalSteps={5}
      onSubmit={handleSubmit}
    />
  );
}

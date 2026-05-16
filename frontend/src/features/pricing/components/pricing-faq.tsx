"use client";

import React from "react";
import { ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
  {
    question: "How does the AI review my code?",
    answer: "CodePilot AI uses a combination of large language models and static analysis tools to understand your code's context, logic, and potential security flaws.",
  },
  {
    question: "Is my source code secure?",
    answer: "Yes. We encrypt all data in transit and at rest. We never use your private code to train our base models without explicit consent.",
  },
  {
    question: "Can I cancel my subscription at any time?",
    answer: "Absolutely. You can cancel your subscription from your billing settings at any time. You will maintain access until the end of your billing cycle.",
  },
  {
    question: "Do you support GitLab or Bitbucket?",
    answer: "Currently, we offer deep integration with GitHub. GitLab and Bitbucket support are in our active roadmap for Q3 2024.",
  },
];

export function PricingFaq() {
  const [openIndex, setOpenIndex] = React.useState<number | null>(null);

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {FAQS.map((faq, i) => (
        <div key={i} className="border border-border rounded-xl overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors"
          >
            <span className="font-bold">{faq.question}</span>
            <ChevronDown className={`h-5 w-5 transition-transform ${openIndex === i ? "rotate-180" : ""}`} />
          </button>
          <AnimatePresence>
            {openIndex === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="p-6 pt-0 text-sm text-muted-foreground leading-relaxed">
                  {faq.answer}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

import { useCV } from '../context/CVContext';

const TargetJobForm = () => {
  const { cvData, setTargetJob } = useCV();

  return (
    <div className="bg-blue-50 border border-blue-200 p-5 rounded-xl mb-6 shadow-sm">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl">🎯</span>
        <label className="font-bold text-blue-900 text-sm uppercase tracking-wide">
          Target Job Description (ATS Optimizer)
        </label>
      </div>
      
      <p className="text-xs text-blue-600 mb-3 leading-relaxed">
        Paste the full job advertisement below. The AI will use this to automatically tailor your 
        Summary, Skills, and Experience to match the job's keywords.
      </p>

      <textarea
        value={cvData.targetJob}
        onChange={(e) => setTargetJob(e.target.value)}
        placeholder="Paste Job Ad here (e.g. 'We are looking for a Junior Business Analyst with SQL skills...')"
        rows={4}
        className="w-full p-3 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm bg-white placeholder-blue-300 transition-all"
      />
    </div>
  );
};

export default TargetJobForm;
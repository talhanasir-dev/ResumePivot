import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Target, 
  ArrowLeft, 
  Search, 
  Save, 
  Trash2,
  Building,
  Briefcase,
  FileText,
  Plus
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface JobAnalysis {
  id: string;
  jobTitle: string;
  company: string;
  jobDescription: string;
  extractedRole: string;
  extractedDomain: string;
  keyRequirements: string[];
  createdDate: string;
  notes: string;
}

const FUNCTIONAL_ROLES = [
  "Product Manager", "Program Manager", "Partnerships Manager", 
  "Project Manager", "Marketing Manager", "Operations Manager"
];

const INDUSTRY_DOMAINS = [
  "Education", "Fintech", "Healthcare", "E-commerce", 
  "SaaS", "Consulting", "Technology", "Media"
];

const JobAnalysis = () => {
  const navigate = useNavigate();
  const [analyses, setAnalyses] = useState<JobAnalysis[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState<Partial<JobAnalysis>>({
    jobTitle: "",
    company: "",
    jobDescription: "",
    extractedRole: "",
    extractedDomain: "",
    keyRequirements: [],
    notes: ""
  });

  useEffect(() => {
    // Load saved analyses from localStorage
    const savedAnalyses = JSON.parse(localStorage.getItem('resumepivot_job_analyses') || '[]');
    setAnalyses(savedAnalyses);
  }, []);

  const analyzeJobDescription = () => {
    if (!currentAnalysis.jobDescription || currentAnalysis.jobDescription.length < 50) {
      toast.error("Please provide a job description with at least 50 characters");
      return;
    }

    setIsAnalyzing(true);

    // Simulate AI analysis with mock logic
    setTimeout(() => {
      const description = currentAnalysis.jobDescription!.toLowerCase();
      
      // Extract functional role based on keywords
      let extractedRole = "";
      if (description.includes("product manager") || description.includes("product management")) {
        extractedRole = "Product Manager";
      } else if (description.includes("program manager") || description.includes("program management")) {
        extractedRole = "Program Manager";
      } else if (description.includes("partnership") || description.includes("business development")) {
        extractedRole = "Partnerships Manager";
      } else if (description.includes("project manager") || description.includes("project management")) {
        extractedRole = "Project Manager";
      } else if (description.includes("marketing")) {
        extractedRole = "Marketing Manager";
      } else {
        extractedRole = "Operations Manager";
      }

      // Extract domain based on keywords
      let extractedDomain = "";
      if (description.includes("education") || description.includes("learning") || description.includes("school")) {
        extractedDomain = "Education";
      } else if (description.includes("fintech") || description.includes("financial") || description.includes("payment")) {
        extractedDomain = "Fintech";
      } else if (description.includes("healthcare") || description.includes("medical") || description.includes("health")) {
        extractedDomain = "Healthcare";
      } else if (description.includes("ecommerce") || description.includes("e-commerce") || description.includes("retail")) {
        extractedDomain = "E-commerce";
      } else if (description.includes("saas") || description.includes("software as a service")) {
        extractedDomain = "SaaS";
      } else if (description.includes("consulting")) {
        extractedDomain = "Consulting";
      } else if (description.includes("media") || description.includes("content")) {
        extractedDomain = "Media";
      } else {
        extractedDomain = "Technology";
      }

      // Extract key requirements (mock)
      const keyRequirements = [];
      if (description.includes("bachelor") || description.includes("degree")) {
        keyRequirements.push("Bachelor's degree required");
      }
      if (description.includes("5+ years") || description.includes("5 years")) {
        keyRequirements.push("5+ years of experience");
      }
      if (description.includes("agile") || description.includes("scrum")) {
        keyRequirements.push("Agile/Scrum experience");
      }
      if (description.includes("sql") || description.includes("analytics")) {
        keyRequirements.push("Data analysis skills");
      }
      if (description.includes("leadership") || description.includes("team management")) {
        keyRequirements.push("Leadership experience");
      }

      setCurrentAnalysis(prev => ({
        ...prev,
        extractedRole,
        extractedDomain,
        keyRequirements
      }));

      setIsAnalyzing(false);
      toast.success("Job description analyzed successfully!");
    }, 2000);
  };

  const saveAnalysis = () => {
    if (!currentAnalysis.jobTitle || !currentAnalysis.company) {
      toast.error("Please provide job title and company name");
      return;
    }

    const newAnalysis: JobAnalysis = {
      id: Date.now().toString(),
      jobTitle: currentAnalysis.jobTitle!,
      company: currentAnalysis.company!,
      jobDescription: currentAnalysis.jobDescription!,
      extractedRole: currentAnalysis.extractedRole!,
      extractedDomain: currentAnalysis.extractedDomain!,
      keyRequirements: currentAnalysis.keyRequirements!,
      notes: currentAnalysis.notes!,
      createdDate: new Date().toISOString()
    };

    const updatedAnalyses = [newAnalysis, ...analyses];
    setAnalyses(updatedAnalyses);
    localStorage.setItem('resumepivot_job_analyses', JSON.stringify(updatedAnalyses));

    // Reset form
    setCurrentAnalysis({
      jobTitle: "",
      company: "",
      jobDescription: "",
      extractedRole: "",
      extractedDomain: "",
      keyRequirements: [],
      notes: ""
    });

    toast.success("Job analysis saved successfully!");
  };

  const deleteAnalysis = (id: string) => {
    const updatedAnalyses = analyses.filter(analysis => analysis.id !== id);
    setAnalyses(updatedAnalyses);
    localStorage.setItem('resumepivot_job_analyses', JSON.stringify(updatedAnalyses));
    toast.success("Analysis deleted");
  };

  const createResumeFromAnalysis = (analysis: JobAnalysis) => {
    // Store the analysis data for use in resume creation
    localStorage.setItem('resumepivot_current_job_analysis', JSON.stringify(analysis));
    navigate('/create-version');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <Target className="h-6 w-6 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Job Analysis</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Analysis Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Analyze New Job Description</CardTitle>
                <CardDescription>
                  Paste a job description to extract functional role and domain information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Job Title
                    </label>
                    <Input
                      value={currentAnalysis.jobTitle || ""}
                      onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, jobTitle: e.target.value }))}
                      placeholder="Senior Product Manager"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Company
                    </label>
                    <Input
                      value={currentAnalysis.company || ""}
                      onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company Name"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Description
                  </label>
                  <Textarea
                    value={currentAnalysis.jobDescription || ""}
                    onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, jobDescription: e.target.value }))}
                    placeholder="Paste the full job description here..."
                    rows={8}
                  />
                </div>

                <Button 
                  onClick={analyzeJobDescription} 
                  disabled={isAnalyzing || !currentAnalysis.jobDescription}
                  className="w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Search className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Search className="h-4 w-4 mr-2" />
                      Analyze Job Description
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Analysis Results */}
            {(currentAnalysis.extractedRole || currentAnalysis.extractedDomain) && (
              <Card>
                <CardHeader>
                  <CardTitle>Analysis Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Functional Role
                      </label>
                      <Badge variant="secondary" className="text-sm">
                        <Briefcase className="h-3 w-3 mr-1" />
                        {currentAnalysis.extractedRole}
                      </Badge>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Industry Domain
                      </label>
                      <Badge variant="secondary" className="text-sm">
                        <Building className="h-3 w-3 mr-1" />
                        {currentAnalysis.extractedDomain}
                      </Badge>
                    </div>
                  </div>

                  {currentAnalysis.keyRequirements && currentAnalysis.keyRequirements.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Key Requirements
                      </label>
                      <div className="space-y-1">
                        {currentAnalysis.keyRequirements.map((req, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <div className="w-2 h-2 bg-blue-600 rounded-full mr-2"></div>
                            {req}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes (Optional)
                    </label>
                    <Textarea
                      value={currentAnalysis.notes || ""}
                      onChange={(e) => setCurrentAnalysis(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add any additional notes about this job..."
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={saveAnalysis} className="flex-1">
                      <Save className="h-4 w-4 mr-2" />
                      Save Analysis
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        // Save current analysis temporarily and navigate
                        const tempAnalysis = {
                          id: 'temp',
                          jobTitle: currentAnalysis.jobTitle!,
                          company: currentAnalysis.company!,
                          jobDescription: currentAnalysis.jobDescription!,
                          extractedRole: currentAnalysis.extractedRole!,
                          extractedDomain: currentAnalysis.extractedDomain!,
                          keyRequirements: currentAnalysis.keyRequirements!,
                          notes: currentAnalysis.notes!,
                          createdDate: new Date().toISOString()
                        };
                        localStorage.setItem('resumepivot_current_job_analysis', JSON.stringify(tempAnalysis));
                        navigate('/create-version');
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Create Resume
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Saved Analyses */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Saved Analyses</CardTitle>
                <CardDescription>
                  Your previously analyzed job descriptions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {analyses.length === 0 ? (
                  <div className="text-center py-8">
                    <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No job analyses saved yet</p>
                    <p className="text-sm text-gray-400">Analyze your first job description to get started</p>
                  </div>
                ) : (
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {analyses.map((analysis) => (
                      <div key={analysis.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{analysis.jobTitle}</h4>
                            <p className="text-sm text-gray-600">{analysis.company}</p>
                          </div>
                          <div className="flex gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => createResumeFromAnalysis(analysis)}
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => deleteAnalysis(analysis.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                        
                        <div className="flex gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {analysis.extractedRole}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {analysis.extractedDomain}
                          </Badge>
                        </div>
                        
                        <p className="text-xs text-gray-500">
                          {new Date(analysis.createdDate).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default JobAnalysis;
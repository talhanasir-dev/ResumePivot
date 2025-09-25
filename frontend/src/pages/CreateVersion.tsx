import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  ArrowLeft, 
  Save, 
  Target, 
  FileText, 
  Briefcase, 
  Building,
  Wand2,
  CheckCircle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface JobAnalysis {
  id: string;
  jobTitle: string;
  company: string;
  extractedRole: string;
  extractedDomain: string;
  keyRequirements: string[];
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  tags: string[];
}

interface MasterResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    summary: string;
  };
  workExperiences: WorkExperience[];
}

const CreateVersion = () => {
  const navigate = useNavigate();
  const [masterResume, setMasterResume] = useState<MasterResumeData | null>(null);
  const [jobAnalysis, setJobAnalysis] = useState<JobAnalysis | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const [versionData, setVersionData] = useState({
    versionName: "",
    targetRole: "",
    targetCompany: "",
    tagline: "",
    summary: "",
    selectedExperiences: [] as string[]
  });

  useEffect(() => {
    // Load master resume
    const savedResume = localStorage.getItem('resumepivot_master_resume');
    if (savedResume) {
      setMasterResume(JSON.parse(savedResume));
    } else {
      toast.error("No master resume found. Please create one first.");
      navigate('/master-resume');
      return;
    }

    // Load current job analysis if available
    const currentAnalysis = localStorage.getItem('resumepivot_current_job_analysis');
    if (currentAnalysis) {
      const analysis = JSON.parse(currentAnalysis);
      setJobAnalysis(analysis);
      setVersionData(prev => ({
        ...prev,
        targetRole: analysis.extractedRole || "",
        targetCompany: analysis.company || "",
        versionName: `${analysis.extractedRole} - ${analysis.company}`
      }));
      // Clear the temporary analysis
      localStorage.removeItem('resumepivot_current_job_analysis');
    }
  }, [navigate]);

  const generateTailoredContent = () => {
    if (!masterResume || !versionData.targetRole) {
      toast.error("Please provide target role information");
      return;
    }

    setIsGenerating(true);

    // Simulate AI content generation
    setTimeout(() => {
      // Generate tagline based on role
      const taglines = {
        "Product Manager": "Strategic Product Leader",
        "Program Manager": "Cross-Functional Program Expert", 
        "Partnerships Manager": "Strategic Partnership Builder",
        "Project Manager": "Results-Driven Project Leader",
        "Marketing Manager": "Growth-Focused Marketing Leader",
        "Operations Manager": "Operational Excellence Driver"
      };

      const tagline = taglines[versionData.targetRole as keyof typeof taglines] || "Experienced Professional";

      // Generate role-specific summary
      const summaryTemplates = {
        "Product Manager": `Experienced product manager with a proven track record of driving product strategy and execution. Skilled in market analysis, user research, and cross-functional collaboration to deliver innovative solutions that drive business growth.`,
        "Program Manager": `Results-oriented program manager with expertise in managing complex, cross-functional initiatives. Strong background in stakeholder management, process optimization, and delivering strategic programs on time and within budget.`,
        "Partnerships Manager": `Strategic partnerships professional with experience building and managing key business relationships. Proven ability to identify partnership opportunities, negotiate agreements, and drive mutual value creation.`
      };

      const summary = summaryTemplates[versionData.targetRole as keyof typeof summaryTemplates] || 
        `Experienced professional with a strong background in ${versionData.targetRole.toLowerCase()} and a proven track record of delivering results.`;

      // Auto-select relevant experiences based on tags
      const relevantExperiences = masterResume.workExperiences
        .filter(exp => exp.tags.includes(versionData.targetRole))
        .map(exp => exp.id);

      setVersionData(prev => ({
        ...prev,
        tagline,
        summary,
        selectedExperiences: relevantExperiences
      }));

      setIsGenerating(false);
      toast.success("Content generated successfully!");
    }, 2000);
  };

  const toggleExperience = (experienceId: string) => {
    setVersionData(prev => ({
      ...prev,
      selectedExperiences: prev.selectedExperiences.includes(experienceId)
        ? prev.selectedExperiences.filter(id => id !== experienceId)
        : [...prev.selectedExperiences, experienceId]
    }));
  };

  const saveVersion = () => {
    if (!versionData.versionName || !versionData.targetRole) {
      toast.error("Please provide version name and target role");
      return;
    }

    if (versionData.selectedExperiences.length === 0) {
      toast.error("Please select at least one work experience");
      return;
    }

    const newVersion = {
      id: Date.now().toString(),
      versionName: versionData.versionName,
      targetRole: versionData.targetRole,
      targetCompany: versionData.targetCompany,
      tagline: versionData.tagline,
      summary: versionData.summary,
      curatedContent: {
        personalInfo: masterResume?.personalInfo,
        selectedExperiences: masterResume?.workExperiences.filter(exp => 
          versionData.selectedExperiences.includes(exp.id)
        )
      },
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString(),
      syncStatus: 'synced'
    };

    // Save to localStorage
    const existingVersions = JSON.parse(localStorage.getItem('resumepivot_versions') || '[]');
    const updatedVersions = [newVersion, ...existingVersions];
    localStorage.setItem('resumepivot_versions', JSON.stringify(updatedVersions));

    toast.success("Resume version created successfully!");
    navigate('/versions');
  };

  if (!masterResume) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/versions')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Versions
              </Button>
              <Target className="h-6 w-6 text-green-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Create Resume Version</h1>
            </div>
            <Button onClick={saveVersion}>
              <Save className="h-4 w-4 mr-2" />
              Save Version
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Job Analysis Info */}
          {jobAnalysis && (
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="flex items-center text-green-800">
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Using Job Analysis
                </CardTitle>
                <CardDescription className="text-green-700">
                  Creating resume version based on your analysis of {jobAnalysis.jobTitle} at {jobAnalysis.company}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-2">
                  <Badge variant="outline" className="border-green-600 text-green-700">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {jobAnalysis.extractedRole}
                  </Badge>
                  <Badge variant="outline" className="border-green-600 text-green-700">
                    <Building className="h-3 w-3 mr-1" />
                    {jobAnalysis.extractedDomain}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Version Details */}
          <Card>
            <CardHeader>
              <CardTitle>Version Details</CardTitle>
              <CardDescription>
                Provide basic information about this resume version
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Version Name *
                  </label>
                  <Input
                    value={versionData.versionName}
                    onChange={(e) => setVersionData(prev => ({ ...prev, versionName: e.target.value }))}
                    placeholder="e.g., Product Manager - TechCorp"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Target Role *
                  </label>
                  <Input
                    value={versionData.targetRole}
                    onChange={(e) => setVersionData(prev => ({ ...prev, targetRole: e.target.value }))}
                    placeholder="e.g., Senior Product Manager"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Company
                </label>
                <Input
                  value={versionData.targetCompany}
                  onChange={(e) => setVersionData(prev => ({ ...prev, targetCompany: e.target.value }))}
                  placeholder="e.g., TechCorp Inc."
                />
              </div>

              <Button 
                onClick={generateTailoredContent} 
                disabled={isGenerating || !versionData.targetRole}
                variant="outline"
                className="w-full"
              >
                {isGenerating ? (
                  <>
                    <Wand2 className="h-4 w-4 mr-2 animate-spin" />
                    Generating Tailored Content...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-4 w-4 mr-2" />
                    Generate Tailored Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content */}
          {(versionData.tagline || versionData.summary) && (
            <Card>
              <CardHeader>
                <CardTitle>Generated Content</CardTitle>
                <CardDescription>
                  AI-generated tagline and summary based on your target role
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Tagline
                  </label>
                  <Input
                    value={versionData.tagline}
                    onChange={(e) => setVersionData(prev => ({ ...prev, tagline: e.target.value }))}
                    placeholder="4-5 word professional tagline"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role-Specific Summary
                  </label>
                  <Textarea
                    value={versionData.summary}
                    onChange={(e) => setVersionData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Professional summary tailored to the target role..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Experience Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Select Relevant Experience</CardTitle>
              <CardDescription>
                Choose which work experiences to include in this version
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {masterResume.workExperiences.map((exp) => (
                  <div key={exp.id} className="flex items-start space-x-3 p-4 border rounded-lg">
                    <Checkbox
                      id={exp.id}
                      checked={versionData.selectedExperiences.includes(exp.id)}
                      onCheckedChange={() => toggleExperience(exp.id)}
                    />
                    <div className="flex-1">
                      <label htmlFor={exp.id} className="cursor-pointer">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-medium text-gray-900">{exp.position}</h4>
                            <p className="text-sm text-gray-600">{exp.company}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {exp.startDate} - {exp.endDate || "Present"}
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {exp.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {exp.description}
                        </p>
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default CreateVersion;
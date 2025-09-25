import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Upload, 
  FileText, 
  Edit, 
  Save, 
  Plus, 
  X, 
  ArrowLeft,
  Tag,
  Briefcase,
  GraduationCap,
  Award
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  tags: string[];
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  graduationDate: string;
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
  education: Education[];
  skills: string[];
  certifications: string[];
}

const FUNCTIONAL_ROLES = [
  "Product Manager", "Program Manager", "Partnerships Manager", 
  "Project Manager", "Marketing Manager", "Operations Manager"
];

const INDUSTRY_DOMAINS = [
  "Education", "Fintech", "Healthcare", "E-commerce", 
  "SaaS", "Consulting", "Technology", "Media"
];

const MasterResume = () => {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [resumeData, setResumeData] = useState<MasterResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      summary: ""
    },
    workExperiences: [],
    education: [],
    skills: [],
    certifications: []
  });

  useEffect(() => {
    // Load existing master resume from localStorage
    const savedResume = localStorage.getItem('resumepivot_master_resume');
    if (savedResume) {
      setResumeData(JSON.parse(savedResume));
    } else {
      setIsEditing(true); // Start in edit mode if no resume exists
    }
  }, []);

  const handleSave = () => {
    // Validate required fields
    if (!resumeData.personalInfo.fullName || !resumeData.personalInfo.email) {
      toast.error("Please fill in your name and email");
      return;
    }

    if (resumeData.workExperiences.length === 0) {
      toast.error("Please add at least one work experience");
      return;
    }

    // Save to localStorage
    localStorage.setItem('resumepivot_master_resume', JSON.stringify(resumeData));
    setIsEditing(false);
    toast.success("Master resume saved successfully!");
  };

  const addWorkExperience = () => {
    const newExperience: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
      tags: []
    };
    setResumeData(prev => ({
      ...prev,
      workExperiences: [...prev.workExperiences, newExperience]
    }));
  };

  const updateWorkExperience = (id: string, field: keyof WorkExperience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  const removeWorkExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.filter(exp => exp.id !== id)
    }));
  };

  const addTag = (experienceId: string, tag: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map(exp => 
        exp.id === experienceId 
          ? { ...exp, tags: [...exp.tags, tag] }
          : exp
      )
    }));
  };

  const removeTag = (experienceId: string, tagToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperiences: prev.workExperiences.map(exp => 
        exp.id === experienceId 
          ? { ...exp, tags: exp.tags.filter(tag => tag !== tagToRemove) }
          : exp
      )
    }));
  };

  const hasResume = resumeData.personalInfo.fullName || resumeData.workExperiences.length > 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Button variant="ghost" onClick={() => navigate('/')} className="mr-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Dashboard
              </Button>
              <FileText className="h-6 w-6 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Master Resume</h1>
            </div>
            <div className="flex items-center space-x-4">
              {!isEditing && hasResume && (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              )}
              {isEditing && (
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!hasResume && !isEditing ? (
          // Empty state
          <Card className="text-center py-12">
            <CardHeader>
              <Upload className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">Create Your Master Resume</CardTitle>
              <CardDescription className="text-lg">
                Your master resume is the foundation for all tailored versions. 
                Add all your experience, education, and skills here.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => setIsEditing(true)} size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Get Started
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Personal Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="h-5 w-5 mr-2" />
                  Personal Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    {isEditing ? (
                      <Input
                        value={resumeData.personalInfo.fullName}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                        }))}
                        placeholder="John Doe"
                      />
                    ) : (
                      <p className="text-gray-900">{resumeData.personalInfo.fullName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email *
                    </label>
                    {isEditing ? (
                      <Input
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, email: e.target.value }
                        }))}
                        placeholder="john@example.com"
                      />
                    ) : (
                      <p className="text-gray-900">{resumeData.personalInfo.email}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    {isEditing ? (
                      <Input
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, phone: e.target.value }
                        }))}
                        placeholder="(555) 123-4567"
                      />
                    ) : (
                      <p className="text-gray-900">{resumeData.personalInfo.phone}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <Input
                        value={resumeData.personalInfo.location}
                        onChange={(e) => setResumeData(prev => ({
                          ...prev,
                          personalInfo: { ...prev.personalInfo, location: e.target.value }
                        }))}
                        placeholder="San Francisco, CA"
                      />
                    ) : (
                      <p className="text-gray-900">{resumeData.personalInfo.location}</p>
                    )}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Professional Summary
                  </label>
                  {isEditing ? (
                    <Textarea
                      value={resumeData.personalInfo.summary}
                      onChange={(e) => setResumeData(prev => ({
                        ...prev,
                        personalInfo: { ...prev.personalInfo, summary: e.target.value }
                      }))}
                      placeholder="Brief overview of your professional background and key strengths..."
                      rows={4}
                    />
                  ) : (
                    <p className="text-gray-900 whitespace-pre-wrap">{resumeData.personalInfo.summary}</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Work Experience */}
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle className="flex items-center">
                    <Briefcase className="h-5 w-5 mr-2" />
                    Work Experience
                  </CardTitle>
                  {isEditing && (
                    <Button onClick={addWorkExperience} variant="outline" size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      Add Experience
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {resumeData.workExperiences.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No work experience added yet. Click "Add Experience" to get started.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {resumeData.workExperiences.map((exp, index) => (
                      <div key={exp.id} className="border rounded-lg p-4">
                        {index > 0 && <Separator className="mb-4" />}
                        <div className="space-y-4">
                          <div className="flex justify-between items-start">
                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Company
                                </label>
                                {isEditing ? (
                                  <Input
                                    value={exp.company}
                                    onChange={(e) => updateWorkExperience(exp.id, 'company', e.target.value)}
                                    placeholder="Company Name"
                                  />
                                ) : (
                                  <p className="font-medium text-gray-900">{exp.company}</p>
                                )}
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                  Position
                                </label>
                                {isEditing ? (
                                  <Input
                                    value={exp.position}
                                    onChange={(e) => updateWorkExperience(exp.id, 'position', e.target.value)}
                                    placeholder="Job Title"
                                  />
                                ) : (
                                  <p className="font-medium text-gray-900">{exp.position}</p>
                                )}
                              </div>
                            </div>
                            {isEditing && (
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeWorkExperience(exp.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Start Date
                              </label>
                              {isEditing ? (
                                <Input
                                  type="month"
                                  value={exp.startDate}
                                  onChange={(e) => updateWorkExperience(exp.id, 'startDate', e.target.value)}
                                />
                              ) : (
                                <p className="text-gray-900">{exp.startDate}</p>
                              )}
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                End Date
                              </label>
                              {isEditing ? (
                                <Input
                                  type="month"
                                  value={exp.endDate}
                                  onChange={(e) => updateWorkExperience(exp.id, 'endDate', e.target.value)}
                                  placeholder="Leave blank if current"
                                />
                              ) : (
                                <p className="text-gray-900">{exp.endDate || "Present"}</p>
                              )}
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Description
                            </label>
                            {isEditing ? (
                              <Textarea
                                value={exp.description}
                                onChange={(e) => updateWorkExperience(exp.id, 'description', e.target.value)}
                                placeholder="Describe your responsibilities and achievements..."
                                rows={3}
                              />
                            ) : (
                              <p className="text-gray-900 whitespace-pre-wrap">{exp.description}</p>
                            )}
                          </div>

                          {/* Tags */}
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              <Tag className="h-4 w-4 inline mr-1" />
                              Tags (Functional Roles & Domains)
                            </label>
                            <div className="flex flex-wrap gap-2 mb-2">
                              {exp.tags.map((tag) => (
                                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                  {tag}
                                  {isEditing && (
                                    <button
                                      onClick={() => removeTag(exp.id, tag)}
                                      className="ml-1 hover:text-red-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  )}
                                </Badge>
                              ))}
                            </div>
                            {isEditing && (
                              <div className="space-y-2">
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Functional Roles:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {FUNCTIONAL_ROLES.filter(role => !exp.tags.includes(role)).map((role) => (
                                      <Button
                                        key={role}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addTag(exp.id, role)}
                                        className="text-xs h-6"
                                      >
                                        + {role}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <p className="text-xs text-gray-600 mb-1">Industry Domains:</p>
                                  <div className="flex flex-wrap gap-1">
                                    {INDUSTRY_DOMAINS.filter(domain => !exp.tags.includes(domain)).map((domain) => (
                                      <Button
                                        key={domain}
                                        variant="outline"
                                        size="sm"
                                        onClick={() => addTag(exp.id, domain)}
                                        className="text-xs h-6"
                                      >
                                        + {domain}
                                      </Button>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
};

export default MasterResume;
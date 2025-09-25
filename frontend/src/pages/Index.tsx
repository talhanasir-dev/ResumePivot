import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Upload, 
  Target, 
  Copy, 
  Mail, 
  Settings,
  Plus,
  Search,
  Filter
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardStats {
  masterResumeExists: boolean;
  resumeVersions: number;
  coverLetters: number;
  jobAnalyses: number;
}

const Index = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats>({
    masterResumeExists: false,
    resumeVersions: 0,
    coverLetters: 0,
    jobAnalyses: 0
  });

  useEffect(() => {
    // Load dashboard stats from localStorage
    const masterResume = localStorage.getItem('resumepivot_master_resume');
    const versions = JSON.parse(localStorage.getItem('resumepivot_versions') || '[]');
    const coverLetters = JSON.parse(localStorage.getItem('resumepivot_cover_letters') || '[]');
    const jobAnalyses = JSON.parse(localStorage.getItem('resumepivot_job_analyses') || '[]');

    setStats({
      masterResumeExists: !!masterResume,
      resumeVersions: versions.length,
      coverLetters: coverLetters.length,
      jobAnalyses: jobAnalyses.length
    });
  }, []);

  const handleGetStarted = () => {
    if (!stats.masterResumeExists) {
      navigate('/master-resume');
    } else {
      navigate('/create-version');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">ResumePivot</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-green-600 border-green-600">
                Free Tier
              </Badge>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ResumePivot
          </h2>
          <p className="text-lg text-gray-600">
            Create tailored resumes and cover letters for different roles using your master resume
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/master-resume')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Upload className="h-8 w-8 text-blue-600" />
                {stats.masterResumeExists && (
                  <Badge variant="secondary" className="text-green-600">
                    Ready
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">Master Resume</CardTitle>
              <CardDescription>
                {stats.masterResumeExists 
                  ? "View and edit your master resume"
                  : "Upload or create your master resume"
                }
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/job-analysis')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Target className="h-8 w-8 text-green-600" />
                <Badge variant="outline">{stats.jobAnalyses}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">Job Analysis</CardTitle>
              <CardDescription>
                Analyze job descriptions to extract requirements
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/versions')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Copy className="h-8 w-8 text-purple-600" />
                <Badge variant="outline">{stats.resumeVersions}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">Resume Versions</CardTitle>
              <CardDescription>
                Manage your tailored resume versions
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigate('/cover-letters')}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <Mail className="h-8 w-8 text-orange-600" />
                <Badge variant="outline">{stats.coverLetters}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-lg mb-1">Cover Letters</CardTitle>
              <CardDescription>
                Generate and manage cover letters
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* Main CTA Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="text-xl">
              {stats.masterResumeExists ? "Create New Application Materials" : "Get Started"}
            </CardTitle>
            <CardDescription>
              {stats.masterResumeExists 
                ? "Ready to create tailored resumes and cover letters for your next job application"
                : "Upload your master resume to start creating tailored application materials"
              }
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleGetStarted} className="flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                {stats.masterResumeExists ? "Create Resume Version" : "Upload Master Resume"}
              </Button>
              {stats.masterResumeExists && (
                <Button variant="outline" onClick={() => navigate('/job-analysis')}>
                  <Search className="h-4 w-4 mr-2" />
                  Analyze Job Description
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        {(stats.resumeVersions > 0 || stats.jobAnalyses > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Recent Activity</CardTitle>
              <CardDescription>
                Your latest resume versions and job analyses
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.resumeVersions === 0 && stats.jobAnalyses === 0 ? (
                  <p className="text-gray-500 text-center py-8">
                    No recent activity. Create your first resume version to get started.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Recent Versions</h4>
                      <p className="text-sm text-gray-600">
                        {stats.resumeVersions} resume version{stats.resumeVersions !== 1 ? 's' : ''} created
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Job Analyses</h4>
                      <p className="text-sm text-gray-600">
                        {stats.jobAnalyses} job description{stats.jobAnalyses !== 1 ? 's' : ''} analyzed
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  );
};

export default Index;
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Copy, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  Eye,
  Calendar,
  Building,
  Briefcase
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface ResumeVersion {
  id: string;
  versionName: string;
  targetRole: string;
  targetCompany: string;
  tagline: string;
  summary: string;
  curatedContent: any;
  createdDate: string;
  lastModified: string;
  syncStatus: 'synced' | 'outdated' | 'orphaned';
}

const ResumeVersions = () => {
  const navigate = useNavigate();
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredVersions, setFilteredVersions] = useState<ResumeVersion[]>([]);

  useEffect(() => {
    // Load resume versions from localStorage
    const savedVersions = JSON.parse(localStorage.getItem('resumepivot_versions') || '[]');
    setVersions(savedVersions);
    setFilteredVersions(savedVersions);
  }, []);

  useEffect(() => {
    // Filter versions based on search term
    const filtered = versions.filter(version => 
      version.versionName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.targetRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      version.targetCompany.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVersions(filtered);
  }, [searchTerm, versions]);

  const deleteVersion = (id: string) => {
    const updatedVersions = versions.filter(version => version.id !== id);
    setVersions(updatedVersions);
    localStorage.setItem('resumepivot_versions', JSON.stringify(updatedVersions));
    toast.success("Resume version deleted");
  };

  const duplicateVersion = (version: ResumeVersion) => {
    const duplicatedVersion: ResumeVersion = {
      ...version,
      id: Date.now().toString(),
      versionName: `${version.versionName} (Copy)`,
      createdDate: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const updatedVersions = [duplicatedVersion, ...versions];
    setVersions(updatedVersions);
    localStorage.setItem('resumepivot_versions', JSON.stringify(updatedVersions));
    toast.success("Resume version duplicated");
  };

  const downloadVersion = (version: ResumeVersion) => {
    // Mock PDF download functionality
    toast.success(`Downloading ${version.versionName} as PDF...`);
  };

  const getSyncStatusColor = (status: string) => {
    switch (status) {
      case 'synced': return 'text-green-600 border-green-600';
      case 'outdated': return 'text-yellow-600 border-yellow-600';
      case 'orphaned': return 'text-red-600 border-red-600';
      default: return 'text-gray-600 border-gray-600';
    }
  };

  const getSyncStatusText = (status: string) => {
    switch (status) {
      case 'synced': return 'Up to date';
      case 'outdated': return 'Needs sync';
      case 'orphaned': return 'No master';
      default: return 'Unknown';
    }
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
              <Copy className="h-6 w-6 text-purple-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Resume Versions</h1>
            </div>
            <Button onClick={() => navigate('/create-version')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Version
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by version name, role, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm">
                  {filteredVersions.length} version{filteredVersions.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Versions List */}
        {filteredVersions.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <Copy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">
                {versions.length === 0 ? "No Resume Versions Yet" : "No Matching Versions"}
              </CardTitle>
              <CardDescription className="text-lg">
                {versions.length === 0 
                  ? "Create your first tailored resume version from your master resume"
                  : "Try adjusting your search terms"
                }
              </CardDescription>
            </CardHeader>
            {versions.length === 0 && (
              <CardContent>
                <Button onClick={() => navigate('/create-version')} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Version
                </Button>
              </CardContent>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVersions.map((version) => (
              <Card key={version.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <CardTitle className="text-lg line-clamp-1">
                        {version.versionName}
                      </CardTitle>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          <Briefcase className="h-3 w-3 mr-1" />
                          {version.targetRole}
                        </Badge>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${getSyncStatusColor(version.syncStatus)}`}
                    >
                      {getSyncStatusText(version.syncStatus)}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="h-3 w-3 mr-1" />
                    {version.targetCompany}
                  </div>
                  
                  {version.tagline && (
                    <p className="text-sm text-gray-600 italic">
                      "{version.tagline}"
                    </p>
                  )}
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {new Date(version.createdDate).toLocaleDateString()}
                  </div>

                  {version.summary && (
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                      {version.summary}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/edit-version/${version.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadVersion(version)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => duplicateVersion(version)}
                    >
                      <Copy className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteVersion(version.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default ResumeVersions;
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Mail, 
  ArrowLeft, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download, 
  Eye,
  Calendar,
  Building,
  FileText
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CoverLetter {
  id: string;
  letterName: string;
  targetRole: string;
  targetCompany: string;
  content: string;
  resumeVersionId: string;
  createdDate: string;
  lastModified: string;
}

const CoverLetters = () => {
  const navigate = useNavigate();
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredLetters, setFilteredLetters] = useState<CoverLetter[]>([]);

  useEffect(() => {
    // Load cover letters from localStorage
    const savedLetters = JSON.parse(localStorage.getItem('resumepivot_cover_letters') || '[]');
    setCoverLetters(savedLetters);
    setFilteredLetters(savedLetters);
  }, []);

  useEffect(() => {
    // Filter letters based on search term
    const filtered = coverLetters.filter(letter => 
      letter.letterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.targetRole.toLowerCase().includes(searchTerm.toLowerCase()) ||
      letter.targetCompany.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLetters(filtered);
  }, [searchTerm, coverLetters]);

  const deleteLetter = (id: string) => {
    const updatedLetters = coverLetters.filter(letter => letter.id !== id);
    setCoverLetters(updatedLetters);
    localStorage.setItem('resumepivot_cover_letters', JSON.stringify(updatedLetters));
    toast.success("Cover letter deleted");
  };

  const downloadLetter = (letter: CoverLetter) => {
    // Mock PDF download functionality
    toast.success(`Downloading ${letter.letterName} as PDF...`);
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
              <Mail className="h-6 w-6 text-orange-600 mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Cover Letters</h1>
            </div>
            <Button onClick={() => navigate('/create-cover-letter')}>
              <Plus className="h-4 w-4 mr-2" />
              Create Cover Letter
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
                    placeholder="Search by letter name, role, or company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className="text-sm">
                  {filteredLetters.length} letter{filteredLetters.length !== 1 ? 's' : ''}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cover Letters List */}
        {filteredLetters.length === 0 ? (
          <Card className="text-center py-12">
            <CardHeader>
              <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <CardTitle className="text-2xl">
                {coverLetters.length === 0 ? "No Cover Letters Yet" : "No Matching Letters"}
              </CardTitle>
              <CardDescription className="text-lg">
                {coverLetters.length === 0 
                  ? "Create your first cover letter to complement your resume versions"
                  : "Try adjusting your search terms"
                }
              </CardDescription>
            </CardHeader>
            {coverLetters.length === 0 && (
              <CardContent>
                <Button onClick={() => navigate('/create-cover-letter')} size="lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Create First Cover Letter
                </Button>
              </CardContent>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredLetters.map((letter) => (
              <Card key={letter.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start mb-2">
                    <CardTitle className="text-lg line-clamp-1">
                      {letter.letterName}
                    </CardTitle>
                  </div>
                  
                  <div className="space-y-2">
                    <Badge variant="outline" className="text-xs">
                      {letter.targetRole}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-600">
                      <Building className="h-3 w-3 mr-1" />
                      {letter.targetCompany}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center text-xs text-gray-500 mb-4">
                    <Calendar className="h-3 w-3 mr-1" />
                    Created {new Date(letter.createdDate).toLocaleDateString()}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-3 mb-4">
                    {letter.content.substring(0, 150)}...
                  </p>

                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/edit-cover-letter/${letter.id}`)}
                      className="flex-1"
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => downloadLetter(letter)}
                    >
                      <Download className="h-3 w-3" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => deleteLetter(letter.id)}
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

export default CoverLetters;
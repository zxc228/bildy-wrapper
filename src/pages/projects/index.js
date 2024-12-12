import { useState, useEffect } from 'react';
import { fetchProjects, createProject } from '../../services/api';
import ProjectForm from '../../components/ProjectForm';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import withAuth from '../../services/withAuth';

function Projects() {
  const [projects, setProjects] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');
  const token = typeof window !== 'undefined' ? localStorage.getItem('jwt') : null;

  useEffect(() => {
    if (token) {
      fetchProjectsData();
    }
  }, [token]);

  const fetchProjectsData = async () => {
    try {
      const response = await fetchProjects(token);
      setProjects(response.data);
    } catch (err) {
      setError('Failed to load projects: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleCreateProject = async (projectData) => {
    try {
      await createProject(projectData, token);
      setShowForm(false); // Hide the form after success
      fetchProjectsData(); // Refresh the project list
    } catch (err) {
      setError('Failed to create project: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <>
      <Header />
      <div style={{ padding: '20px' }}>
        <h1>Projects</h1>
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button onClick={() => setShowForm(!showForm)} style={{ marginBottom: '20px' }}>
          {showForm ? 'Cancel' : 'Add New Project'}
        </button>

        {showForm && (
          <div style={{ marginBottom: '20px' }}>
            <ProjectForm onSubmit={handleCreateProject} />
          </div>
        )}

        {projects.length > 0 ? (
          <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Code</th>
                <th>Client ID</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id}>
                  <td>{project.id}</td>
                  <td>{project.name}</td>
                  <td>{project.email}</td>
                  <td>{project.code}</td>
                  <td>{project.clientId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No projects available. Add a new one!</p>
        )}
      </div>
      <Footer />
    </>
  );
}

export default withAuth(Projects);

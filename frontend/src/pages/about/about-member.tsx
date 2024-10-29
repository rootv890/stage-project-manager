import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { json } from "stream/consumers";

function AboutMember() {
  const memberId = useParams().memberId;

  function fetchMemberInfo(memberId: string) {
    // fetch member info
    return {
      name: memberId,
      id: `@${memberId}`,
      age: 25,
      twitter: "@johndoe",
      projects: [
        {
          name: "Project 1",
          description: "Description 1",
        },
        {
          name: "Project 2",
          description: "Description 2",
        },
      ],
    };
  }

  if (!memberId) {
    return null;
  }

  const json = fetchMemberInfo(memberId);

  return (
    <div>
      <h1 className="text-2xl">About Member</h1>
      <div>
        <div>
          <div>
            <h4>Name: {json?.name}</h4>
            <h4>Age: {json?.age}</h4>
            <h4>Twitter: {json?.twitter}</h4>
          </div>
          <div>
            <h3>Projects</h3>
            <ul>
              {json?.projects.map((project: any) => (
                <li key={project.name}>
                  <h4>{project.name}</h4>
                  <p>{project.description}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutMember;

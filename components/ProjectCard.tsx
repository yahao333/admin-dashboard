import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export interface ProjectCardProps {
  name: string;
  description?: string;
  url: string;
}

export default function ProjectCard({ name, description, url }: ProjectCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <p className="text-sm text-gray-400">仓库链接：</p>
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="break-all text-blue-400 hover:text-blue-300"
        >
          {url}
        </a>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline">
          <a href={url} target="_blank" rel="noreferrer">打开仓库</a>
        </Button>
      </CardFooter>
    </Card>
  );
}
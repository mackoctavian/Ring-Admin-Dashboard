interface HeadingProps {
    title: string;
    description: string;
    total?: string;
  }
  
  export const Heading: React.FC<HeadingProps> = ({ title, total, description }) => {
    return (
        <div>
            <h2 className="text-3xl font-bold tracking-tight text-green-main">{title}
                {total && <span className="text-lg"> ( {total} )</span>}
            </h2>
            <p className="text-sm text-muted-foreground">{description}</p>
        </div>
    );
  };
  
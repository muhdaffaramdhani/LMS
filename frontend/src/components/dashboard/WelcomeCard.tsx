import { Card } from "@/components/ui/card";

export function WelcomeCard() {
  const progress = 68;

  return (
    <Card className="p-6 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-1">
            Hi Daffa 👋
          </h2>
          <p className="text-primary-foreground/80 mb-6">
            Welcome back! You're doing great this semester.
          </p>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Overall Progress</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="h-2.5 bg-primary-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary-foreground rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="ml-6">
          <div className="relative w-20 h-20">
            <svg className="w-20 h-20 transform -rotate-90">
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                className="text-primary-foreground/20"
              />
              <circle
                cx="40"
                cy="40"
                r="36"
                stroke="currentColor"
                strokeWidth="6"
                fill="transparent"
                strokeDasharray={`${progress * 2.26} 226`}
                className="text-primary-foreground"
              />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-lg font-bold">
              {progress}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
}

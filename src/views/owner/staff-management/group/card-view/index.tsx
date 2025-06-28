import React, { useMemo } from 'react';
import { ChevronRight, Info, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Item {
  label: string;
  value: string;
}

interface GroupCardViewProps {
  title: string;
  leftPaneTitle: string;
  rightPaneTitle: string;
  leftPaneGroups: Item[];
  rightPaneGroups: Item[];
  description: string;
  onSave: (selectedGroups: Item[]) => void;
}

const GroupCardView: React.FC<GroupCardViewProps> = ({
  title,
  leftPaneTitle,
  rightPaneTitle,
  leftPaneGroups,
  rightPaneGroups,
  description,
  onSave,
}) => {
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedGroups, setSelectedGroups] = React.useState<Item[]>(rightPaneGroups || []);

  const filteredLeftPaneGroups = useMemo(() => {
    if (!searchTerm) {
      return leftPaneGroups || [];
    }
    return leftPaneGroups?.filter((group) => group.label.toLowerCase().includes(searchTerm.toLowerCase())) || [];
  }, [searchTerm, leftPaneGroups]);

  const handleSubmit = () => {
    if (onSave) {
      onSave(selectedGroups);
    }
  };

  const handleAddGroup = (group: Item) => {
    if (!selectedGroups.some((g) => g.value === group.value)) {
      setSelectedGroups((prev) => [...prev, group]);
    }
  };

  return (
    <Card className="w-full mx-auto shadow-lg p-0">
      <CardHeader className="bg-primary rounded-t-lg py-3">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0 space-y-4">
        <div className="grid grid-cols-2 gap-4 p-4">
          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>{leftPaneTitle}</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedGroups(leftPaneGroups)}
                className="text-xs h-8 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Select All
              </Button>
            </div>
            <div className="mb-2">
              <Input
                type="text"
                placeholder="Search permission group..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border"
              />
            </div>
            <ScrollArea className="h-60 border rounded-md">
              <div className="p-2">
                {filteredLeftPaneGroups.map((group, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between px-2 py-1 hover:bg-muted rounded cursor-pointer"
                    onClick={() => handleAddGroup(group)}
                  >
                    <span>{group.label}</span>
                    <Button size="icon" variant="ghost">
                      <ChevronRight className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <Label>{rightPaneTitle}</Label>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setSelectedGroups([])}
                className="text-xs h-8 !rounded-button whitespace-nowrap cursor-pointer"
              >
                Detele All
              </Button>
            </div>
            <div className="mb-2">
              <Input type="text" placeholder="Search permission group..." className="w-full border" />
            </div>
            <ScrollArea className="h-60 border rounded-md">
              <div className="p-2">
                {selectedGroups.map((group, index) => (
                  <div key={index} className="flex items-center justify-between px-2 py-1 hover:bg-muted rounded">
                    <span>{group.label}</span>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => setSelectedGroups((groups) => groups.filter((g) => g !== group))}
                    >
                      <X className="size-4 text-muted-foreground" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center flex-1">
            <Info className="size-4 md:size-5 mr-1" />
            <p className="truncate">{description}</p>
          </div>
          <Button onClick={handleSubmit} className="ml-4">
            Save
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default GroupCardView;

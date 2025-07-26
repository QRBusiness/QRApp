import { TrendingDown, TrendingUp } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

interface CardBadgeProps {
  label?: string;
  total?: string;
  ratio?: string;
  trend?: string;
}

const CardBadge = ({ label, total, ratio, trend }: CardBadgeProps) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">{total}</CardTitle>
        <CardAction>
          <Badge variant="outline">
            {trend === 'up' ? <TrendingUp /> : <TrendingDown />}
            {ratio}
          </Badge>
        </CardAction>
      </CardHeader>
      <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending {trend} {ratio} this month{' '}
          {trend === 'up' ? <TrendingUp className="size-4" /> : <TrendingDown className="size-4" />}
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardBadge;

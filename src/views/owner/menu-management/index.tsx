import { useEffect, useState } from 'react';
import { ADMIN_ROLE, OWNER_ROLE } from '@/constains';
import { Laptop, Plus, Tablet } from 'lucide-react';
import { Hint } from '@/components/common/hint';
import { toggleMenuDisplayOptionState, useMenuDisplayOptionState } from '@/components/common/states/menuStates';
import { useUserState } from '@/components/common/states/userState';
import { Button } from '@/components/ui/button';
import CreateNewMenuDialog from './dialog/create-new-menu-dialog';
import MobileMenuView from './mobile-card/mobile-view';
import type { Menu } from './table/columns';
import MenuTable from './table/page';

async function getData(): Promise<Menu[]> {
  // Fetch data from your API here.
  return [
    {
      id: '1',
      name: 'Avocado Toast with Poached Egg',
      description: 'Sourdough bread topped with smashed avocado, poached eggs, cherry tomatoes, and microgreens.',
      price: 12.99,
      image:
        'https://readdy.ai/api/search-image?query=Gourmet%20avocado%20toast%20with%20poached%20egg%20on%20sourdough%20bread%2C%20topped%20with%20cherry%20tomatoes%20and%20microgreens%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20shallow%20depth%20of%20field%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=1&orientation=squarish',
      available: true,
      category: 'Breakfast',
      subcategory: 'Toast',
    },
    {
      id: '2',
      name: 'Truffle Mushroom Risotto',
      description: 'Creamy Arborio rice with wild mushrooms, truffle oil, parmesan cheese, and fresh herbs.',
      price: 18.5,
      image:
        'https://readdy.ai/api/search-image?query=Creamy%20mushroom%20risotto%20with%20truffle%20oil%20and%20parmesan%20cheese%20garnished%20with%20fresh%20herbs%2C%20professional%20food%20photography%2C%20soft%20natural%20lighting%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=2&orientation=squarish',
      available: true,
      category: 'Lunch',
      subcategory: 'Risotto',
    },
    {
      id: '3',
      name: 'Grilled Salmon Bowl',
      description: 'Grilled salmon fillet served with quinoa, roasted vegetables, avocado, and lemon-dill sauce.',
      price: 22.99,
      image:
        'https://readdy.ai/api/search-image?query=Grilled%20salmon%20fillet%20with%20quinoa%2C%20roasted%20vegetables%20and%20avocado%20in%20a%20bowl%20with%20lemon-dill%20sauce%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=3&orientation=squarish',
      available: true,
      category: 'Lunch',
      subcategory: 'Bowl',
    },
    {
      id: '4',
      name: 'Spicy Korean Fried Chicken',
      description: 'Crispy double-fried chicken tossed in spicy gochujang sauce, served with pickled radish.',
      price: 16.99,
      image:
        'https://readdy.ai/api/search-image?query=Crispy%20Korean%20fried%20chicken%20pieces%20glazed%20with%20spicy%20red%20gochujang%20sauce%2C%20garnished%20with%20sesame%20seeds%20and%20green%20onions%2C%20served%20with%20pickled%20radish%2C%20professional%20food%20photography%2C%20bright%20lighting%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=4&orientation=squarish',
      available: false,
      category: 'Dinner',
      subcategory: 'Chicken',
    },
    {
      id: '5',
      name: 'Mediterranean Mezze Platter',
      description: 'Assortment of hummus, baba ganoush, tabbouleh, falafel, olives, and warm pita bread.',
      price: 24.5,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Appetizer',
      subcategory: 'Platter',
    },
    {
      id: '6',
      name: 'Wagyu Beef Burger',
      description: 'Premium Wagyu beef patty with caramelized onions, aged cheddar, truffle aioli on a brioche bun.',
      price: 26.99,
      image:
        'https://readdy.ai/api/search-image?query=Gourmet%20Wagyu%20beef%20burger%20with%20caramelized%20onions%2C%20melted%20aged%20cheddar%20cheese%2C%20and%20truffle%20aioli%20on%20a%20brioche%20bun%2C%20professional%20food%20photography%2C%20dramatic%20lighting%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=6&orientation=squarish',
      available: true,
      category: 'Lunch',
      subcategory: 'Burger',
    },
    {
      id: '7',
      name: 'Thai Green Curry',
      description: 'Aromatic coconut curry with vegetables, tofu, Thai basil, and jasmine rice.',
      price: 17.5,
      image:
        'https://readdy.ai/api/search-image?query=Thai%20green%20curry%20with%20vegetables%20and%20tofu%20in%20coconut%20milk%2C%20garnished%20with%20Thai%20basil%20leaves%2C%20served%20with%20jasmine%20rice%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=7&orientation=squarish',
      available: true,
      category: 'Dinner',
      subcategory: 'Curry',
    },
    {
      id: '8',
      name: 'Classic Margherita Pizza',
      description: 'Wood-fired pizza with San Marzano tomato sauce, fresh mozzarella, basil, and olive oil.',
      price: 15.0,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Dinner',
      subcategory: 'Pizza',
    },
    {
      id: '9',
      name: 'Caesar Salad Supreme',
      description: 'Crisp romaine, parmesan, garlic croutons, and creamy Caesar dressing.',
      price: 11.5,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Appetizer',
      subcategory: 'Salad',
    },
    {
      id: '10',
      name: 'Eggs Benedict',
      description: 'Poached eggs, Canadian bacon, and hollandaise sauce on toasted English muffin.',
      price: 13.99,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Breakfast',
      subcategory: 'Eggs',
    },
    {
      id: '11',
      name: 'Chicken Caesar Wrap',
      description: 'Grilled chicken, romaine, parmesan, and Caesar dressing wrapped in a spinach tortilla.',
      price: 12.5,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Lunch',
      subcategory: 'Wrap',
    },
    {
      id: '12',
      name: 'Vegan Buddha Bowl',
      description: 'Brown rice, chickpeas, roasted sweet potato, kale, avocado, and tahini dressing.',
      price: 14.0,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Lunch',
      subcategory: 'Bowl',
    },
    {
      id: '13',
      name: 'French Onion Soup',
      description: 'Rich beef broth, caramelized onions, toasted baguette, and melted Gruyère cheese.',
      price: 10.5,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Appetizer',
      subcategory: 'Soup',
    },
    {
      id: '14',
      name: 'Pancake Stack',
      description: 'Fluffy pancakes with maple syrup, fresh berries, and whipped cream.',
      price: 11.0,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Breakfast',
      subcategory: 'Pancake',
    },
    {
      id: '15',
      name: 'BBQ Pulled Pork Sandwich',
      description: 'Slow-cooked pulled pork, tangy BBQ sauce, coleslaw, and pickles on a toasted bun.',
      price: 13.5,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Lunch',
      subcategory: 'Sandwich',
    },
    {
      id: '16',
      name: 'Seafood Paella',
      description: 'Spanish rice dish with saffron, shrimp, mussels, calamari, and peas.',
      price: 27.0,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Dinner',
      subcategory: 'Rice',
    },
    {
      id: '17',
      name: 'Falafel Wrap',
      description: 'Crispy falafel, lettuce, tomato, cucumber, and tahini sauce in a warm pita.',
      price: 10.99,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: false,
      category: 'Lunch',
      subcategory: 'Wrap',
    },
    {
      id: '18',
      name: 'Lemon Ricotta Pancakes',
      description: 'Light pancakes with lemon zest and ricotta, served with blueberry compote.',
      price: 12.0,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Breakfast',
      subcategory: 'Pancake',
    },
    {
      id: '19',
      name: 'Shrimp Tacos',
      description: 'Grilled shrimp, cabbage slaw, avocado, and chipotle mayo in soft corn tortillas.',
      price: 16.0,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: false,
      category: 'Lunch',
      subcategory: 'Taco',
    },
    {
      id: '20',
      name: 'Chocolate Lava Cake',
      description: 'Warm chocolate cake with a gooey molten center, served with vanilla ice cream.',
      price: 9.5,
      image:
        'https://readdy.ai/api/search-image?query=Mediterranean%20mezze%20platter%20with%20hummus%2C%20baba%20ganoush%2C%20tabbouleh%2C%20falafel%2C%20olives%20and%20pita%20bread%2C%20professional%20food%20photography%2C%20bright%20natural%20lighting%2C%20overhead%20shot%2C%20appetizing%20presentation%2C%20isolated%20on%20light%20neutral%20background%2C%20high%20resolution&width=400&height=400&seq=5&orientation=squarish',
      available: true,
      category: 'Dessert',
      subcategory: 'Cake',
    },
  ];
}

const MenuManagement = () => {
  const { isTable: isTableView } = useMenuDisplayOptionState();
  const [openCreateNewMenuDialog, setOpenCreateNewMenuDialog] = useState(false);
  const [data, setData] = useState<Menu[]>([]);
  const user = useUserState();
  const isShowAction = user?.role === OWNER_ROLE || user?.role === ADMIN_ROLE;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getData();
        setData(data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  return (
    <div className="container mx-auto pb-10 space-y-4">
      {isShowAction && (
        <div className="flex items-center space-x-2 justify-self-end mr-4 md:mr-0">
          <CreateNewMenuDialog
            open={openCreateNewMenuDialog}
            onOpenChange={setOpenCreateNewMenuDialog}
            onSubmit={() => {
              // Handle submit
            }}
            onCancel={() => {
              // Handle cancel
            }}
          >
            <Button variant="default" className="rounded-full md:rounded w-9 h-9 md:w-auto">
              <Plus className="md:mr-2 h-4 w-4" />
              <p className="text-sm hidden md:block">Add New Menu Item</p>
            </Button>
          </CreateNewMenuDialog>

          {isTableView ? (
            <Hint label="Switch to Card View" align="end">
              <Button variant={'outline'} size={'icon'} onClick={() => toggleMenuDisplayOptionState()}>
                <Tablet className="size-5" strokeWidth={2.5} />
              </Button>
            </Hint>
          ) : (
            <Hint label="Switch to Table View">
              <Button variant={'secondary'} size={'icon'} onClick={() => toggleMenuDisplayOptionState()}>
                <Laptop className="size-5" strokeWidth={2.5} />
              </Button>
            </Hint>
          )}
        </div>
      )}
      {isTableView ? <MenuTable data={data} /> : <MobileMenuView items={data} />}
    </div>
  );
};

export default MenuManagement;

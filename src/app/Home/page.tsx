import Coin from '@/components/Coin';
import CheckboxWrapper from './components/CheckboxWrapper';

function page() {
  return (
    <div>
      <CheckboxWrapper />
      <br />
      <Coin coin={100}/>
    </div>
  );
}
export default page;

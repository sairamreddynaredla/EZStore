// Combined products entry — update imports below to include category arrays

// Example imports (uncomment and expand as you add data):
// import { dryFood as dogsDry } from './dogs/dryFood'
// import { wetFood as dogsWet } from './dogs/wetFood'
// import { treats as dogsTreats } from './dogs/treats'
// import { prescription as dogsPrescription } from './dogs/prescription'

// import { dryFood as catsDry } from './cats/dryFood'
// import { wetFood as catsWet } from './cats/wetFood'
// import { treats as catsTreats } from './cats/treats'

// Import actual category arrays (add more as you populate them)
import { dogsDryFood } from './dogs/dryFood'
import { wetFood as dogsWet } from './dogs/wetFood'
import { dogsMeatyTreats as dogsTreats } from './dogs/meaty-treats'
import { prescription as dogsPrescription } from './dogs/prescription'
import { dogsDentalTreats } from './dogs/Dental-Treats'
import { dogsBiscuitsCookies } from './dogs/Biscuits&Cookies'
import { dogsVegetarianFood } from './dogs/VegetarianFood'
import { dogsPuppyFood } from './dogs/puppyFood'
import { dogsFreshFood } from './dogs/FreshFood'
import { catCreamyTreats } from './cats/creamy-treats'
import { catCrunchyTreats } from './cats/crunchy-treats'
import { grainFreeFood } from './cats/Grainfreefood'
import { dryFood as catsDry } from './cats/dryFood'
import { kittenFood } from './cats/kittenFood'
import { catMeatyTreats } from './cats/meaty-treats'
import { catPrescriptionFood } from './cats/prescription'
import { catWetFood } from './cats/wetFood'
import { birdsFood } from './birds'
import { fishFood } from './fish'
import { rabbitFood } from './rabbit'
import { hamsterFood } from './hamster'

// Combine all category arrays into a single `products` array.
export const products = [
	...(dogsDryFood || []),
	...(dogsWet || []),
	...(dogsPuppyFood || []),
	...(dogsFreshFood || []),
	...(grainFreeFood || []),
	...(catsDry || []),
	...(kittenFood || []),
	...(catMeatyTreats || []),
	...(catWetFood || []),
	...(birdsFood || []),
	...(fishFood || []),
	...(catCreamyTreats || []),
	...(catCrunchyTreats || []),
	...(catPrescriptionFood || []),
	...(rabbitFood || []),
	...(hamsterFood || []),
	...(dogsVegetarianFood || []),
	...(dogsTreats || []),
	...(dogsBiscuitsCookies || []),
	...(dogsDentalTreats || []),
	...(dogsPrescription || []),
]

export default products

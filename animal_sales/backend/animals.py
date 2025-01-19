import random
from faker import Faker

fake = Faker()

# Western-themed name generator
FIRST_NAMES = ['Buck', 'Tex', 'Duke', 'Hoss', 'Wyatt', 'Doc', 'Butch', 'Jesse', 'Billy', 'Clint']
LAST_NAMES = ['McGraw', 'Walker', 'Cassidy', 'Holliday', 'Earp', 'James', 'Carson', 'Cody', 'Hickok', 'Eastwood']

ANIMALS = {
    'Ornery Bull': 55,
    'Dirty Rotten Mule': 8,
    'Mean Ol Buckin Bull': 65,
    'Kickin Mule': 12,
    'Rattler with Attitude': 3,
    'Stubborn Pack Donkey': 9,
    'Wild Mustang': 45,
    'Rough Stock Bull': 70,
    'One-Eyed Coyote': 2,
    'Fence-Jumpin Mare': 35,
    'Untamed Bronco': 50,
    'No Good Billy Goat': 4,
    'Spittin Llama': 20,
    'Angry Ranch Dog': 3,
    'Ornery Longhorn': 48,
    'Buckin Paint Horse': 38,
    'Snake-Bit Quarter Horse': 28,
    'Cattle-Chasin Heeler': 6,
    'Barn-Bustin Buffalo': 80,
    'Outlaw Stallion': 60,
    'Mangy Prairie Dog': 1,
    'Cross-Eyed Rooster': 2,
    'Limpin Jackrabbit': 1,
    'Toothless Raccoon': 2,
    'Three-Legged Skunk': 1,
    'Tone-Deaf Turkey': 3,
    'Lazy Pack Rat': 1,
    'Grumpy Groundhog': 2,
    'Clumsy Armadillo': 2,
    'Balding Vulture': 1
}

def generate_customer_name():
    if random.random() < 0.7:  # 70% chance of western name
        return f"{random.choice(FIRST_NAMES)} {random.choice(LAST_NAMES)}"
    return fake.name()

def generate_random_purchase():
    num_animals = random.randint(1, 4)
    purchases = []
    
    for _ in range(num_animals):
        animal = random.choice(list(ANIMALS.keys()))
        quantity = random.randint(1, 5)
        purchases.append({
            'animal': animal,
            'price': ANIMALS[animal] * quantity,
            'quantity': quantity
        })
    
    return {
        'customer_name': generate_customer_name(),
        'purchases': purchases,
        'total': sum(p['price'] for p in purchases)
    }

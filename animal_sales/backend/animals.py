import random
from faker import Faker

fake = Faker()

ANIMALS = {
    'African Grey Parrot': 1200,
    'Ball Python': 300,
    'Bearded Dragon': 150,
    'Bengal Cat': 2500,
    'Capybara': 3000,
    'Chinchilla': 200,
    'Cockatoo': 1500,
    'Corn Snake': 100,
    'Fennec Fox': 4500,
    'Ferret': 250,
    'Hedgehog': 300,
    'Iguana': 200,
    'Koi Fish': 500,
    'Maine Coon Cat': 1800,
    'Macaw': 2000,
    'Muntjac Deer': 5000,
    'Sugar Glider': 400,
    'Savannah Cat': 15000,
    'Tarantula': 150,
    'Tortoise': 800
}

def generate_customer_name():
    return fake.name()

def generate_random_purchase():
    num_animals = random.randint(1, 4)
    purchases = []
    
    for _ in range(num_animals):
        animal = random.choice(list(ANIMALS.keys()))
        purchases.append({
            'animal': animal,
            'price': ANIMALS[animal]
        })
    
    return {
        'customer_name': generate_customer_name(),
        'purchases': purchases,
        'total': sum(p['price'] for p in purchases)
    }

import json
from typing import Dict, List

from faker import Faker
import random

Faker.seed(0)
fake = Faker()

FIELDS = [
	"job",
	"company",
	"ssn",
	"residence",
	"blood_group",
	"website",
	"username",
	"name",
	"sex",
	"address",
	"mail",
	]


def gen_data(fields: List[str], num_records: int) -> List[Dict]:
	records = []
	for _ in range(num_records):
		output_dict = fake.profile(fields=fields)
		output_dict["birthdate"] = output_dict["birthdate"].strftime(
			"%Y-%m-%d"
			)
		records.append(output_dict)
	return records


if __name__ == "__main__":
	for i in range(5):
		fields = random.sample(FIELDS, 5) + ["birthdate"]
		for j in range(5):
		    data = gen_data(fields, 1000)
		    with open(f'./events/schema-{i}-{j}.json', 'w') as f:
			    json.dump(data, f, indent=2)

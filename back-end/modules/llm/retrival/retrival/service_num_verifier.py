import re
from word2number import w2n

def extract_numbers_regex(input_string):
    pattern = r'[\d,.]+'

    matches = re.findall(pattern, input_string)

    numbers = []
    for match in matches:
        match = match.replace(',', '')
        try:numbers.append(float(match))
        except ValueError: pass

    return numbers

def extract_numbers(text):
    numbers = extract_numbers_regex(text)
    numbers.extend([w2n.word_to_num(match.group()) for match in re.finditer(r'\b(?:\w+\s)*\w+\s(?:thousand|million|billion)\b', text)])
    return numbers

def compare_numbers(text_a, text_b):
    numbers_a = extract_numbers(text_a)
    numbers_b = extract_numbers(text_b)
    
    missing_numbers = [num for num in numbers_b if num not in numbers_a]
    
    return missing_numbers
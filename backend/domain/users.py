def validate_dni(dni: str) -> bool:
    if not dni.isdigit() or len(dni) != 8:
        return False

    actual_check_digit = int(dni[-1])
    digits = dni[:7]
    weights = [3, 2, 7, 6, 5, 4, 3, 2]
    total = sum(int(d) * w for d, w in zip(digits, weights))
    remainder = total % 11
    expected_check_digit = (11 - remainder) % 11
    if expected_check_digit == 10:
        expected_check_digit = 0
    return actual_check_digit == expected_check_digit

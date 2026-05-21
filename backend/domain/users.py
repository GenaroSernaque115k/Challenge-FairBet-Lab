def validate_dni(dni: str) -> bool:
    if not dni.isdigit() or len(dni) != 8:
        return False

    weights = [3, 2, 7, 6, 5, 4, 3, 2]
    total = sum(int(d) * w for d, w in zip(dni, weights))
    remainder = total % 11
    check_digit = 11 - remainder

    if check_digit == 11:
        return True
    elif check_digit == 10:
        return False
    else:
        return True

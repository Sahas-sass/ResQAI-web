import spacy

# Load the English NLP model you downloaded earlier
nlp = spacy.load("en_core_web_sm")

# Define our keyword dictionaries for severity
CRITICAL_WORDS = ["fire", "trapped", "unconscious", "bleeding", "explosion", "heart attack", "not breathing", "gun", "shot"]
HIGH_WORDS = ["crash", "accident", "broken bone", "robbery", "assault", "head injury", "smash"]
MEDIUM_WORDS = ["fever", "pain", "stolen", "lost", "theft", "sick", "cut"]

def analyze_sos(description: str) -> str:
    """
    Analyzes an emergency description and returns a severity score:
    Critical, High, Medium, or Low.
    """
    # Convert text to lowercase and process it with spaCy
    doc = nlp(description.lower())
    
    # Extract the base words (lemmas) to catch variations (e.g., "bleeding" -> "bleed")
    words = [token.lemma_ for token in doc if not token.is_stop and not token.is_punct]
    text_to_search = " ".join(words)
    
    # Check for Critical flags first (Highest priority)
    for word in CRITICAL_WORDS:
        if word in text_to_search or word in description.lower():
            return "Critical"
            
    # Check for High flags
    for word in HIGH_WORDS:
        if word in text_to_search or word in description.lower():
            return "High"
            
    # Check for Medium flags
    for word in MEDIUM_WORDS:
        if word in text_to_search or word in description.lower():
            return "Medium"
            
    # If no severe keywords are found, default to Low
    return "Low"
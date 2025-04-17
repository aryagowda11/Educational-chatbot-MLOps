
import logging

# Global instances
logger = None


def init_logger():
    """Initialize logger"""
    global logger
    if logger is None:
        logging.basicConfig(
            level=logging.INFO,
            format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
            handlers=[logging.StreamHandler()],
                )

        logger = logging.getLogger(__name__)
    return logger

def get_logger():
    """Get or create logger"""
    global logger
    if logger is None:
        logger = init_logger()
    return logger


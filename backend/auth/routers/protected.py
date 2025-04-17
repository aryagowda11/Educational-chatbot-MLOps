from fastapi import APIRouter, Depends
from ..dependencies.security import get_authorized_user, enforce_role_id
from core.models.user import User

router = APIRouter(
    prefix="/protected",
    tags=["Protected"]
)

@router.get(
    "/profile"
)
async def user_profile(
    user: User = Depends(get_authorized_user([1, 2, 3]))
):
    """
    Retrieves the profile details of the authenticated user.

    This endpoint allows a logged-in user to access their profile information. 
    It requires the user to have a minimum role ID of **3**.

    ### Parameters:
    - **user** (`User`, required): The authenticated user making the request.

    ### Returns:
    - **dict**: The user's profile details.

    ### Example Response:
    ```json
    {
        "user_id": 123,
        "email": "user@example.com",
        "status": "active"
    }
    ```

    ### Errors:
    - `403 Forbidden`: If the user does not have the required role.
    """
    # --- Start of Masked Code ---
    # Profile retrieval logic removed for submission.
    # This typically involves:
    # 1. Enforcing role ID requirements using enforce_role_id.
    # 2. Returning relevant user profile fields.
    # --- End of Masked Code ---
    logger.info(f"User profile access masked for user_id: {user.user_id}")
    # Placeholder return for demonstration
    return {
        "user_id": user.user_id,
        "email": "masked@example.com", # Masked email
        "status": "masked" # Masked status
    }

@router.get(
    "/admin-dashboard"
)
async def admin_dashboard(
    user: User = Depends(get_authorized_user([1]))
):
    """
    Access the **admin dashboard**.

    This endpoint provides access to **administrative functionalities** and 
    is restricted to **users with admin privileges (role ID = 1)**.

    ### Parameters:
    - **user** (`User`, required): The authenticated admin user.

    ### Returns:
    - **dict**: A response containing the admin dashboard message.

    ### Example Response:
    ```json
    {
        "message": "Admin dashboard content",
        "org_id": 5678
    }
    ```

    ### Errors:
    - `403 Forbidden`: If the user is not an admin.
    """
    # --- Start of Masked Code ---
    # Admin dashboard access logic removed for submission.
    # This typically involves:
    # 1. Enforcing role ID requirements (admin only) using enforce_role_id.
    # 2. Returning admin-specific data or a confirmation message.
    # --- End of Masked Code ---
    logger.info(f"Admin dashboard access masked for user_id: {user.user_id}")
    # Placeholder return for demonstration
    return {
        "message": "Admin dashboard content (masked)",
        "org_id": user.org_id # Keep org_id if needed for context, or mask too
    }

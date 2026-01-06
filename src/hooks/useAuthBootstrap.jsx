import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setRolePermissions, setEmployeeId } from "../slices/authorizationSlice";
import { getScreenPermissions2 } from "../queries/loginquery";
import { mergeAllRolePermissions } from "../utils/mergeAllRolePermissions";

export const useAuthBootstrap = () => {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const bootstrap = async () => {
            const token = localStorage.getItem("authToken");
            const type = localStorage.getItem("authTokenType");

            if (!token) {
                setAuthenticated(false);
                setLoading(false);
                return;
            }

            try {
                // 🔐 BACKEND VALIDATION (this is what you were missing)
                const rawPermissions = await getScreenPermissions2(token, type);

                const { mergedPermissions, roles } =
                    mergeAllRolePermissions(rawPermissions);

                dispatch(
                    setRolePermissions({
                        mergedPermissions,
                        roles,
                    })
                );

                const empId = localStorage.getItem("empId");
                if (empId) dispatch(setEmployeeId(empId));

                setAuthenticated(true);
            } catch (err) {
                console.error("[AuthBootstrap] invalid session", err);

                // 🔥 CLEAR EVERYTHING
                localStorage.clear();
                setAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        bootstrap();
    }, [dispatch]);

    return { loading, authenticated };
};
